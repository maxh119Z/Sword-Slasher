function chatsend(){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "chat.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.responseText);
      }
  };
  
  xhr.send(localStorage.getItem("name")+ " " + document.getElementById("chatbox").value);
  
}
function displaychat(){
  
  fetch('chat.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {

  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}