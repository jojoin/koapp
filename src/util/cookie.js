/**
 * cookie相关
 */




/**
 * 读取
 */
exports.get = function(req, name)
{
    if( !req.cookies ){
        req.cookies = {};
        // 解析
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
            var parts = Cookie.split('=');
            req.cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
    }
    // 返回
    return req.cookies[name];
}


/**
 * 设置
 */
exports.set = function(res, name, val, options)
{
    res.setHeader('Set-Cookie', serialize(name, String(val), options));
    /*
    {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week 
    }));
    */
}


/**
 * 删除
 */
exports.del = function(res, name)
{
    res.setHeader('Set-Cookie', serialize(name, '', {
        path: '/',
        maxAge: 0,
    }));
}



/////////////////////  帮助函数  ////////////////////////




let encode = encodeURIComponent;
let fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;


function serialize(name, val, options)
{

  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}