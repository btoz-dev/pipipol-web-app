export function PostData(type, encodedDataUser) {
    let BaseURL = `https://apipipipol.btoz.co.id/api/`;
    //let BaseURL = 'http://localhost/PHP-Slim-Restful/api/';

    return new Promise((resolve, reject) =>{
    
        const AUTH_TOKEN = localStorage.getItem('id_token');
        console.log("TOKEN LOCAL STORAGE")
        console.log(AUTH_TOKEN)
         
        fetch(BaseURL+type, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Accept':'application/json; charset=utf-8',
              'x-access-token': AUTH_TOKEN
            },
            body: encodedDataUser
          })
          .then((response) => response)
          .then((res) => {
            console.log("=== RESPONSE DARI POSTDATA ===")
            console.log(res)
            resolve(res);
          })
          .catch((error) => {
            console.log("=== RESPONSE DARI POSTDATA ===")
            console.log(error)
            reject(error);
          });

  
      });
}