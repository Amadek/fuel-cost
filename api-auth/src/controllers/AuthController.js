const Ensure = require('@amadek/js-sdk/Ensure');
const axios = require('axios').default;
const createError = require('http-errors');

class AuthController {
  constructor (config) {
    Ensure.notNull(config);
    this._config = config;
  }

  route (router) {
    router.get('/', this.getAuth.bind(this));
    router.get('/redirect', this.getAuthRedirect.bind(this));
    return router;
  }

  getAuth (req, res) {
    const url = axios.getUri({
      method: 'get',
      url: 'https://github.com/login/oauth/authorize',
      params: {
        client_id: this._config.api.github.clientId,
        redirect_url: this._getBaseUrl(req) + '/redirect'
      }
    });

    res.redirect(url);
  }

  getAuthRedirect (req, res, next) {
    // If code aka request token not provided, throw Bad Request.
    if (!req.query.code) throw createError(400);

    const requestToken = req.query.code;
    // accessToken declared out of arrow scope below to be available in Promise chain.
    let accessToken;

    Promise.resolve()
      .then(() => axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        params: {
          client_id: this._config.api.github.clientId,
          client_secret: this._config.api.github.clientSecret,
          code: requestToken
        },
        headers: {
          accept: 'application/json'
        }
      }))
      .then(response => response.data.access_token)
      .then(token => {
        accessToken = token;
        return axios({
          method: 'put',
          url: this._config.api.putTokenUrl,
          params: {
            client_secret: this._config.api.github.clientSecret,
            token: accessToken
          }
        })
       })
      .then(() => res.send(accessToken))
      .then(next)
      .catch(next);
  }

  _getBaseUrl (req) {
    return req.headers.host + req.baseUrl;
  }
}

module.exports = AuthController;
