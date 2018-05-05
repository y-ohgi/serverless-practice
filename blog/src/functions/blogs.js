const AWS = require('aws-sdk')

const ENV = process.env

const params = {
  endpoint: process.env.DDB_LOCAL_FQDN
}

const option = !params.endpoint ? {} : {
  region: 'localhost',
  endpoint: `http://${params.endpoint}:8000`
}
const docClient = new AWS.DynamoDB.DocumentClient(option)


const index = (event, context, callback) => {
  const param = {
    TableName: 'blogs',
    Limit: 5,
    ScanIndexForward: true
  }

  if (event.queryStringParameters.limit) param.Limit = event.queryStringParameters.limit

  if (event.queryStringParameters.blog_id) param.ExclusiveStartKey = { id: event.queryStringParameters.blog_id }

  docClient.scan(param).promise()
    .then(d => {
      callback(null, {
        statusCode: 200,
        body: d.Items.map(i => { return {id: i.id, body: i.body, title: i.title} })
      })
    })
    .catch(e => {
      callback({
        statusCode: 500
      }, null)
    })
}

const view = (event, context, callback) => {
  const param = {
    TableName: 'blogs',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': event.pathParameters.blog_id
    },

    ConsistentRead: false
  }

  docClient.query(param, (e, d) => {
    console.log(e?e:d)

    if (e) {
      callback({
        statusCode: 500,
        body: JSON.stringify({'msg': e})
      }, null)
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({'msg': d})
      })
    }
  })
}

module.exports = {
  index
}
