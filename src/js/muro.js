// post
const postUser = document.getElementById("textarea-post-user");
const btnPublic = document.getElementById("btn-publicar");
const bodyPosts = document.getElementById("section_posts");
// const selectPrivacity = document.getElementById("selec-privacity")


// COMPONENTE HEADER
const menuHeader = document.getElementById("menu-header");
menuHeader.innerHTML = headerHtml;
// COMPONENTE GENERAL (POSTEAR Y PUBLICACIONES)
// const tabLondon = document.getElementById("London");
// tabLondon.innerHTML = muroTabs;
// COMPONENTE LISTA DE HOSPITALES
const tabParis = document.getElementById("Paris");
tabParis.innerHTML = tableClinic;

const logOut = document.getElementById("header-nav-log-out");
logOut.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = '../../src/'
  })
});

// FUNCIÓN PARA EL MENÚ DESPLEGABLE
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

// FUNCIÓN PARA APARECER SEGUN TABS
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(cityName).style.display = 'block';
  evt.currentTarget.className += ' active';
}
// Get the element with id='defaultOpen' and click on it
document.getElementById('defaultOpen').click();

// contador de clicks (AUN NO ESTA TERMINADO)
var clicks = 0;

function clickME() {
  clicks += 1;
  document.getElementsByClassName('post-likes')[0].innerHTML = clicks;
}

function clickME2() {
  clicks += 1;
  document.getElementsByClassName('post-likes')[1].innerHTML = clicks;
}

//FUNCION PARA CREAR POST Y GUARDAR EN DATABASE DE FIREBASE
function makePost() {
  const x = firebase.auth().currentUser;
  let datePosted = new Date();
  let posts = {
    fecha: datePosted,
    description: postUser.value,
    uid: x.uid
  }
  var key = firebase.database().ref().child('users').push().key;
  posts.idPost = key;
  var updates = {};
  updates['/post/' + key] = posts;
  updates['/user-post/' + x.uid + '/' + key] = posts;
  firebase.database().ref().update(updates)
};

window.onload = () => {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems);
  mostrarAllPost()
}
// FUNCION PARA MOSTRAR POST EN INTERFAZ
function mostrarAllPost() {
  let cont = 0;
  firebase.database().ref('/post')
    .on('child_added', (newPost) => {
      var post = newPost.val();
      cont++;
      bodyPosts.innerHTML += ` 
        <div class="row" id="${post.idPost}">
          <div class="col s12 m9">
            <div class="card">
              <div class="card-content black-text">
                <div class="col s12 m6 right">
                  <a class="dropdown-trigger right" href="#" data-target="dropdown${cont}">
                    <i class="material-icons left">more_vert</i>
                  </a>
                  <ul id="dropdown${cont}" class="dropdown-content">
                    <li data-idpost="${post.idPost}"  onclick="editPost(this) ">
                      <a >
                        <i class="material-icons">mode_edit</i>Editar</a>
                    </li >
                    <li data-idpost="${post.idPost}"  onclick="deletePost(this)">
                      <a>
                        <i class="material-icons">cloud</i>Eliminar</a>
                    </li>
                  </ul>
                </div>
                <span class="card-title">John Smith</span>
                <p class="${post.idPost}">
                  ${post.description}
                </p>
                <textarea class="dnone materialize-textarea ${post.idPost}" row="2">${post.description}</textarea>

              </div>
              <div class="card-action">
                <a class="heart">
                  <i class="material-icons">favorite</i>
                </a>
                <a class="post-likes">0</a>
                <a>Comentario</a>
                <a id="${post.idPost}" onclick="savePost(this)" class="dnone waves-effect waves-light btn">
                  <i class="mdi-maps-rate-review left" type="button"></i>Guardar
                </a>
              </div>
            </div>
          </div>
        </div>
    `;
    var elems = document.querySelectorAll('#section_posts .dropdown-trigger');
    var instances = M.Dropdown.init(elems);
    })
}
// FUNCION QUE PERMITE ELIMINAR POST
function deletePost(post){
  let postId = post.dataset.idpost,
    postBlock = document.querySelector("div#"+postId);
  const x = firebase.auth().currentUser;
  var updates = {};
  updates['/post/' + postId] = null;
  updates['/user-post/' + x.uid + '/' + postId] = null;
  //aparece mensaje de confirmación para eliminiacion del mensaje
  swal({
    title: "Está Seguro que desea eliminar esta publicación?",
    text: "Puedes editar esta publicación si quieres cambiar algo.!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      firebase.database().ref().update (updates, function(error){
        if(error){
          alert("No se pudo eliminar")
        }else{
          postBlock.parentNode.removeChild(postBlock);
          swal("Tu archivo ha sido eliminado!", {
            icon: "success",
          });
        }
      })
     
    } 
  });

}
// FUNCION QUE PERMITE EDITAR PUBLICACION
function editPost(post) {
  let postId = post.dataset.idpost,
      postP = document.querySelector("p."+postId),
      saveButton = document.querySelector("a#"+postId),
      postTextArea = document.querySelector("textarea."+postId);
      //mostrar text area y oculpar p tag
      postP.style.display = "none";
      postTextArea.style.display = "block";
      saveButton.style.display = "inline-block";
  
}
// FUNCION QUE PERMITE GUARDAR  EN FIREBASE PUBLICACION EDITADA
function savePost(post){
  let postId = post.attributes["0"].value,
      newPost = document.querySelector("textarea."+postId).value;
  const x = firebase.auth().currentUser;
  let dateUpdated = new Date();
  let newPostValues = {
    fecha: dateUpdated,
    idPost: postId,
    description: newPost,
    uid: x.uid
  }
  var updates = {};
  updates['/post/' + postId] = newPostValues;
  updates['/user-post/' + x.uid + '/' + postId] = newPostValues;
  firebase.database().ref().update(updates, function(error) {
    if (error) {
      alert("Ocurrio un error, intentelo mas tarde!");
    } else {
      let postP = document.querySelector("p."+postId),
        saveButton = document.querySelector("a#"+postId),
        posTextArea = document.querySelector("textarea."+postId);
      postP.innerText = newPost;
      posTextArea.innerHTML = newPost;
      postP.style.display = "block";
      posTextArea.style.display = "none";
      saveButton.style.display = "inline-block";
    }
  })

}
btnPublic.addEventListener("click", function () { makePost() });
