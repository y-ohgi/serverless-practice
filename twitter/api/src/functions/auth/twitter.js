const OAuth = require('oauth').OAuth;
const Cookie = require('cookie')

const ENV = process.env

/***
 * [GET] Twitterログイン画面へのリダイレクト
 *
 * TwitterログインURLの発行&発行したURLへリダイレクトを行う
 */
const auth = (event, context, callback) => {
  const oa = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    ENV.TWITTER_CONSUMER_KEY,
    ENV.TWITTER_CONSUMER_SECRET,
    '1.0',
    'https://' + event.headers.Host + '/' + event.requestContext.stage + '/auth/callback',
    'HMAC-SHA1'
  )

  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      callback(error, null)
    } else {
      callback(null, {
        statusCode: 301,
        headers: {
          'Location': 'https://twitter.com/oauth/authenticate?oauth_token='+oauth_token,
          'Set-Cookie': 'oauth_token_secret=' + oauth_token_secret
        },
        body: JSON.stringify({ 'message': 'redirect...' })
      })
    }
  })
}


/***
 * [GET] クライアントへのリダイレクト
 * 
 * Twitterアクセストークンの発行&クライアントへリダイレクトを行う
 */
const callback = (event, context, callback) => {
  const oa = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    ENV.TWITTER_CONSUMER_KEY,
    ENV.TWITTER_CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1'
  )
  
  oa.getOAuthAccessToken(
    event.queryStringParameters.oauth_token,
    Cookie.parse(event.headers.Cookie).oauth_token_secret,
    event.queryStringParameters.oauth_verifier,
    function(error, access_token, access_token_secret, results) {      
      if (error) {
        callback(error, null)
      } else {
        const clienturl = ENV.TWITTER_CLIENT_REDIRECT_URL + '?access_token=' + access_token + '&access_token_secret=' + access_token_secret
        
        callback(null, {
          statusCode: 301,
          headers: {
            'Location': clienturl
          },
          body: JSON.stringify({ 'message': 'redirect...' })
        })
      }
    }
  )
  
}

module.exports = {
  auth,
  callback
}
