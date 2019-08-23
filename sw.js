// TODO - Figure out how to write this in Typescript and compile it with the rest of the code

/* eslint-disable no-restricted-globals */
const PURSE_PAYMENT_METHOD_ID = 'https://paywithpurse.com/'
const INTERLEDGER_PAYMENT_METHOD_ID = 'interledger'

// TODO - dictionary indexed by payment request id?
let paymentRequest = undefined

self.addEventListener('install', async (e) => {
  // Perform install steps
})

self.addEventListener('activate', async (e) => {
  // Perform post-install steps now that this is the main sw
})

self.addEventListener('canmakepayment', async (e) => {
  // Does the PR have supported methods?
  const interledgerData = getMethodData(e, INTERLEDGER_PAYMENT_METHOD_ID)
  const purseData = getMethodData(e, PURSE_PAYMENT_METHOD_ID)
  e.respondWith(interledgerData !== undefined || purseData !== undefined)
})

self.addEventListener('paymentrequest', async function(e) {
  console.log(e)

  paymentRequest = new PaymentRequestPromise()
  e.respondWith(paymentRequest.promise)

  const methodData = getMethodData(e, 'interledger')
  // TODO - Get data for 'https://paywithpurse.com/'

  // TODO - Handle `methodData` is undefined
  // TODO - Validate `methodData`
  
  /**
   * Convert PaymentRequest data into URI params for Pay with Purse
   * {
   *   paymentRequest?: {
   *     id: string,
   *     origin: string,
   *     instrumentKey: string,
   *     total: 
   *   },
   *   stripe?: {
   *     customer?: string,
   *     plan: string, 
   *   },
   *   user?: { 
   *     email: string
   *   },
   *   subscription?: SubscriptionTerms
   * }
   */

  const requestData = Object.assign({}, methodData, {
    paymentRequest: {
      id: e.paymentRequestId,
      origin: e.paymentRequestOrigin,
      topOrigin: e.topOrigin,
      instrumentKey: e.instrumentKey,
      total: e.total,
    }
  })

  try {
    const client = await e.openWindow(`/checkout?q=${encodeURI(JSON.stringify(requestData))}`)
    if(!client) {
      paymentRequest.reject('Failed to open window');
    }
    // TODO - Catch window close before we get the response
  } catch (e) {
    paymentRequest.reject(e);
  }

})

self.addEventListener('message', (e) => {
  console.log('message:', e)
  if(paymentRequest === undefined) {
    //TODO - We've got a message but no way to respond to the payment request, should we kill the sw
    console.error('No Payment Request to respond to.', e)
    return
  }
  if(e.data && e.data.methodName) {
    paymentRequest.resolve(e.data);
  } else {
    paymentRequest.reject(e.data);
  }  
});

function getMethodData(e, methodName) {
  if(e.methodData && e.methodData.length) {
    for(let i = 0; i < e.methodData.length; i++) {
      
      if(e.methodData[i].supportedMethods === methodName) {
        return e.methodData[i].data
      }
    }
  }
  return undefined
}

function PaymentRequestPromise() {

  /** @private {function(T=): void} */
  this.resolve_ = undefined

  /** @private {function(*=): void} */
  this.reject_ = undefined

  /** @private {!Promise<T>} */
  this.promise_ = new Promise(function(resolve, reject) {
    this.resolve_ = resolve
    this.reject_ = reject
  }.bind(this))
}

PaymentRequestPromise.prototype = {

  /** @return {!Promise<T>} */
  get promise() {
    return this.promise_
  },

  /** @return {function(T=): void} */
  get resolve() {
    return this.resolve_
  },

  /** @return {function(*=): void} */
  get reject() {
    return this.reject_
  }
}