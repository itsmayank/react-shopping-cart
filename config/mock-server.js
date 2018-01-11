const express = require('express')
const crypto = require('crypto');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const md = require('markdown-it')({linkify: true})

const secret = (new Date()).getTime().toString();
const server = express();
const routes = {
  verifyUser: "/cr/v2/merchant/verify/identifier",
  getToken: "/jm/auth/oauth/v2/token",
  verifyOtp: "/cr/v2/merchant/verify/otp",
  createOtp: "/cr/v2/merchant/create/otp",

  //to be called in signup flow with otp, its actually create password
  //account call. It can be called for signup or forgot password
  passwordChange: "/cr/v3/dip/user/password/change",

  // this is change password, its updating password from settings
  changePassword: "/cr/v1/change/password",
  getMerchantParams: "/ncr/v2/merchant/prms/get",
  checkMerchantStatus: "/ncr/v2/merchant/status/check",
  accountDetail: "/ncr/v2/merchant/jm/account/details",
  findMerchantMids: "/ncr/v2/merchant/find",
  midDetails: "/ncr/v2/merchant/details",
  txnDetails: "/ncr/v2/merchant/transaction/details",
  txnSummary: "/cr/v2/merchant/transaction/summary"
}
let app_const = {
	phone: ["9999999999", "8888888888", "7777777777"],
	access_token: null,
	refresh_token: null,
	password: "password",
	otp: "1111"
}
const docPath = path.join(__dirname, "merchant-api-doc.md");
const postmanDataPath = path.join(__dirname, "jm-merchant-apis.postman_collection.json");
const port = "3001";
const isAuthorized = req => {
  return req.get("Authorization") && (req.get("Authorization").split(" ")[1] == app_const.access_token);
}

server.use(bodyParser());
server.use(morgan('dev'));
server.use(function (req, res, next) {
  // if (req.method === 'POST' || req.method === 'PUT') {
  //   req.body.createdAt = Date.now()
  // }
  res.header('Access-Control-Allow-Origin', '*');
  next()
})

const createAccessToken = () => {
	app_const.access_token = crypto.createHmac('sha256', secret).update(`This is access token ${(new Date()).toString()}`).digest('hex');
	app_const.refresh_token = crypto.createHmac('sha256', secret).update(`This is refresh token ${(new Date()).toString()}`).digest('base64');
}

server.get("/doc", function(req, res, next) {
  res.setHeader('Transfer-Encoding', "chunked");
  fs.readFile(docPath, 'utf8', (err, data) => {
    if (err) throw err;
    res.write(md.render(data));
    return;
  });
});

server.get("/postman/data", function(req, res, next) {
  var filename = path.basename(postmanDataPath);
  var mimetype = mime.lookup(postmanDataPath);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  var filestream = fs.createReadStream(postmanDataPath);
  filestream.pipe(res);
});

server.post(routes.verifyUser, function(req, res, next) {
	if (app_const.phone.indexOf(req.body.mobileNo) > -1) {
		res.send({
			"responseCode": "9001",
			"responseMessage": "Mobile number Already Exists"
		})
	} else {
		res.send({
			"responseCode": "0000",
			"responseMessage": "Mobile number doesn\u0027t exists",
			"isMerchantExist": "N"
		})
	}
});

server.post(routes.getToken, function(req, res, next) {
  createAccessToken();
	if (req.body.grant_type == "password") {
		if ((app_const.phone.indexOf(req.body.username) > -1) && req.body.password == app_const.password) {
			res.send({
				"access_token": app_const.access_token,
				"token_type": "Bearer",
				"expires_in": 3600,
				"refresh_token": app_const.refresh_token,
				"scope": "oob"
			})
		} else if ((app_const.phone.indexOf(req.body.username) > -1) && req.body.password != app_const.password) {
			res.send({
				"error": "01017",
				"error_description": "Identifier and password don't match"
			})
		}
	} else if (req.body.grant_type == "refresh_token") {
		if (req.body.refresh_token == app_const.refresh_token) {
			res.send({
				"access_token": app_const.access_token,
				"token_type": "Bearer",
				"expires_in": 3600,
				"refresh_token": app_const.refresh_token,
				"scope": "oob"
			});
		} else {
      res.send({errorCode: "405", errorMessage: "Refresh token is expired, again login"})
    }
	}
});

server.post(routes.verifyOtp, function(req, res, next) {
	app_const.phone.push(req.body.mobileNo);
	res.send({
		"responseCode": "200",
		"responseMessage": "OK"
	});
});

server.post(routes.createOtp, function(req, res, next) {
	res.send({
		"responseCode": "0000",
		"responseMessage": "OTP is successfully send to your number. Please enter it."
	});
});

server.use(function (req, res, next) {
 if (isAuthorized(req) || (/\.json/g).test(req.url)) { // add your authorization logic here
   next() // continue to JSON Server router
  //  res.send({code: "OK"})
 } else {
   res.sendStatus(401)
 }
})

server.listen(port, function() {
	console.log(`Mock server hosted on port ${port}`)
})
