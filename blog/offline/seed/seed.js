const faker = require('faker')
const AWS = require('aws-sdk')



const params = {
  stage: process.env.STAGE,
  endpoint: process.env.DDB_LOCAL_FQDN
}

const option = {
  region: 'ap-northeast-1'
}

// !params.endpoint ? {} : {
//   region: 'localhost',
//   endpoint: `http://${params.endpoint}:8000`
// }

const docClient = new AWS.DynamoDB.DocumentClient(option)


// TODO: 10件単位でwriteするよう書き換える
const putBlog = (num = 1) => {
  const param = {
    RequestItems: {
      blogs: []// ,

      // tag_blogs: [],
      // tags: [
      //   {
      //     PutRequest: {
      //       Item: {
      //         id: '1',
      //         name: 'hoge'
      //       }
      //     }
      //   },
      //   {
      //     PutRequest: {
      //       Item: {
      //         id: '2',
      //         name: 'fuga'
      //       }
      //     }
      //   },
      //   {
      //     PutRequest: {
      //       Item: {
      //         id: '3',
      //         name: 'piyo'
      //       }
      //     }
      //   },
      //   {
      //     PutRequest: {
      //       Item: {
      //         id: '4',
      //         name: 'aaa'
      //       }
      //     }
      //   },
      //   {
      //     PutRequest: {
      //       Item: {
      //         id: '5',
      //         name: 'bbb'
      //       }
      //     }
      //   }
      // ]
    }
  }

  for (let i=0; i < num; i++) {
    const blog_id = faker.random.number() + ''
    param.RequestItems.blogs.push({
      PutRequest: {
        Item: {
          id: blog_id,
          title: faker.lorem.lines(1),
          body: faker.lorem.lines(10),
        }
      }
    })

    // param.RequestItems.tag_blogs.push({
    //   PutRequest: {
    //     Item: {
    //       tag_id: ~~(Math.random()*5) + 1 + '',
    //       blog_id: blog_id
    //     }
    //   }
    // })

  }

  docClient.batchWrite(param, (e, d) => console.log(e?e:d))

}

putBlog(10)
