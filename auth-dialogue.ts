export class AuthDialogue {

  public async getToken(options: any): Promise<any> {
    if('PaymentRequest' in window) {
      // TODO - Use the https://paywithpurse/ payment method id
      const prData = [
        {
          supportedMethods: 'https://adrianhopebailie.github.io/auth',
          data: {}
        }
      ]

      /**
       * TODO - Determine the initial payment amount and line items from subscription details
       * This may involve calling the public APIs for getting the subscription details 
       */
      const currency = 'XXX'
      const value = '1'
      const amount = { currency, value }
      const prDisplayItems = {
        displayItems: [{
          label: 'Dummy Payment',
          amount
        }],
        total: {
          amount,
          label: 'Total'
        }
      }

      const request = new PaymentRequest(prData, prDisplayItems)
      try {
        const canMakePayment = await request.canMakePayment()
        if(canMakePayment) {
          return new Promise<any>(async (resolve, reject) => {
            try {
              const result = await request.show()
              result.complete('success')
              if(result.methodName === 'https://adrianhopebailie.github.io/auth') {
                resolve({
                  token: result.details.token
                })
              }  
            } catch (error) {
              // Error calling show
              // TODO - Should we fall back to iframe in some failed PR API situations
              resolve({ error })      
            }
          })
        }  
      } catch (error) {
        // Error calling canMakePayment
        // Ignore as we'll fall back to iframe
      }

    } 

    // Fallback to iframe
    return false
  }
}
