enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  Conflict = 409,
  LengthRequired = 411,
  PreconditionFailed = 412,
  UnsupportedMediaType = 415,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export default HttpStatus;
