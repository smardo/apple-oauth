/* global Base64 */

export function getClientIdFromOptions(options, servicesConfig) {
  const { shard } = options;
  if (shard) {
    return servicesConfig[`clientId-${shard}`];
  }
  return servicesConfig.clientId;
}

export function getAppIdFromOptions(options) {
  const { appId } = options;
  return appId || null;
}

export function getServiceConfiguration(appId = null) {
  const service = ServiceConfiguration.configurations.findOne({
    service: "apple",
  });
  const serviceConfiguration = service[appId] || service;
  serviceConfiguration.secret = typeof service.secret === 'string' ? service.secret : service.secret[appId || 'default'];
  return service[appId] || service;
}

export function stateParam({
  loginStyle,
  credentialToken,
  redirectUrl,
  ...rest
}) {
  const state = {
    loginStyle,
    credentialToken,
    isCordova: Meteor.isCordova,
    ...rest,
  };

  if (loginStyle === 'redirect' || loginStyle === 'popup')
    state.redirectUrl = redirectUrl || `${window.location}`;

  // Encode base64 as not all login services URI-encode the state
  // parameter when they pass it back to us.
  // Use the 'base64' package here because 'btoa' isn't supported in IE8/9.
  return Base64.encode(JSON.stringify(state));
}
