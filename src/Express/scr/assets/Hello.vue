<template>
  <div class="hello">
    <div align="center">
      <table class="table">
        <thead>
          <tr>
            <th>Correo enviado, {{ MailStatus.mail }}</th>
          </tr>
        </thead><!--
        <tbody>
          <tr>
            <td>Prueba: {{ User.firstName }}</td>
            <td>{{ User.lastName }}</td>
            <td>{{ User.age }}</td>
          </tr>
        </tbody>-->
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "hello",
  data() {
    return {
      MailStatus: {}
    };
  },
  mounted() {
    axios.post("http://localhost:3000/SendMail/",{
      MailType:'1',
      valName:'Prueba',
      val1:'Contraseña',
      val2:'',
      val3:'',
      Mailto:'rogelio.santa@itw.mx'
    } )
      .then(response => {
        console.log(response.data);
        this.MailStatus = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
