<template>
  <div class="container">
    <div class="mb-3">
      <form @submit.prevent="fecthData">
        <h3 for="transactionHash" class="form-label">
          {{ title }}
        </h3>
        <input :type="input.type" :name="input.name" :class="input.class" :id="input.id" :placeholder="input.placeholder">
        <button :type="button.type" :class="button.class">{{button.text}}</button>
      </form>
    </div>

    <!-- Display the API response data -->
    <div v-if="responseClean.requestStatus === true">
      <div class="alert alert-success" role="alert">
        <p>
          <strong>
            Transaction Hash : 
          </strong>
          {{responseClean.trxHash}}
        </p>
        <p>
          <strong>
            Sender Address : 
          </strong>
          {{responseClean.senderAddres}}
        </p>
        <p>
          <strong>
            Reciever Address : 
          </strong>
          {{responseClean.recieverAddres}}
        </p>
        <p>
          <strong>
            Amount : 
          </strong>
          {{responseClean.trxAmount}}
        </p>
        <p>
          <strong>
            Gass Price : 
          </strong>
          {{responseClean.trxGasPrice}}
        </p>
        <p>
          <strong>
            Status : 
          </strong>
          {{responseClean.trxStatus}}
        </p>
        <p>
          <strong>
            Request Origin : 
          </strong>
          {{responseOrigin}}
        </p>
      </div>
    </div>
    <div v-if="responseClean.requestStatus === false">
      <div class="alert alert-danger" role="alert">
        Invalid request!
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      title: "Tron Transaction Detail",
      input: {
        type: "text",
        id: "transactionHash",
        name: "trxHash",
        class: "form-control",
        placeholder: "Input transaction hash"
      },
      button: {
        type: "submit",
        id: "submitForm",
        class: "btn btn-primary mt-3",
        text: "Submit"
      },
      transactionHash: '',
      responseData: null,
      responseClean: {
        trxStatus: null,
        trxHash: null,
        senderAddres: null,
        recieverAddres: null,
        trxAmount: null,
        trxGasPrice: null,
        requestStatus: null,
      },
      responseOrigin: null,
    }
  },
  methods: {
    getPropertyVal(propertyName, obj) {
      try {
        return obj[propertyName]
      } catch (error) {
        return null
      }
    },
    fecthData(submitEvent) {
      const trx_hash = submitEvent.target.elements.trxHash.value;
      if(trx_hash) {
        const trxHistory = JSON.parse(localStorage.getItem('trxHistory')|| "{}")
        const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${encodeURIComponent(trx_hash)}`;

        const localObj = this.getPropertyVal(trx_hash, trxHistory)

        if(localObj) {
          this.responseClean = localObj
          this.responseOrigin = 'local'
        } else {
          axios.get(url).then(respose => {
            const data = respose.data
            this.responseData = data;
            this.responseClean.trxStatus = data.confirmed == true ? "Confirmed" : "Unconfirmed";
            this.responseClean.trxHash = data.hash;
            this.responseClean.senderAddres = data.ownerAddress;
            this.responseClean.recieverAddres = data.toAddress;
            this.responseClean.trxAmount = `${data.contractData.amount/1000000} TRX`;
            this.responseClean.trxGasPrice = `${data.cost.net_fee_cost/1000000} TRX`;
            this.responseClean.requestStatus = true;
            this.responseOrigin = 'online'
  
            trxHistory[trx_hash] = this.responseClean
            localStorage.setItem('trxHistory', JSON.stringify(trxHistory))
  
          }).catch(error => {
            this.responseClean.requestStatus = false;
            console.error("Error fetching data :", error)
          })

        }

      } else {
        console.log('error trx hash : ', trx_hash)
      }
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>