export function PostData(type, encodedDataUser) {

    let BaseURL = `https://api.pipipol.com/api/`;
    // let BaseURL = `https://api.pipipol.com/api/`;
    //let BaseURL = 'http://localhost/PHP-Slim-Restful/api/';

    return new Promise((resolve, reject) =>{
    
        const AUTH_TOKEN = localStorage.getItem('id_token');
        console.log("TOKEN LOCAL STORAGE")
        console.log(AUTH_TOKEN)
         
        fetch(BaseURL+type, {
            method: 'POST',
            headers: {
              'x-access-token': AUTH_TOKEN,
              'Access-Control-Allow-Origin': '*',
              'origin': 'x-requested-with',
              'Access-Control-Allow-Headers': 'X-Requested-With',
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Accept':'application/json; charset=utf-8'
            },
            body: encodedDataUser
          })
          .then((response) => response)
          .then((res) => {
            console.log("=== RESPONSE SUCCESS DARI POSTDATA ===")
            console.log(res)
            resolve(res);
          })
          // .then(function(response){
          //   return response.json()
          // }).then(function(body){
          //   console.log("PostData =>", body);
          // })
          .catch((error) => {
            localStorage.removeItem('id_token');
            sessionStorage.removeItem('userData');
            console.log("=== RESPONSE ERROR DARI POSTDATA ===")
            console.log(error)
            reject(error);
          });

  
      });
}