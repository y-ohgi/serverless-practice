const params = {
  stage: process.env.STAGE,
  endpoint: process.env.DDB_LOCAL_FQDN
}

const DynamoDB = () => {
  const option = params.stage != 'offline' ? {} : {
    region: 'localhost',
    endpoint: `http://${DDB_LOCAL_FQDN}:8000`
  }

  return new AWS.DynamoDB.DocumentClient(option)
}

module.exports = {
  DynamoDB
}
