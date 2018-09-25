const headerWall = document.getElementById("menu-header");
// agregando contenido del componente header menu al header del muro
headerWall.innerHTML = headerMenu;
// boton de cerrar sesion del componente header
const logOut = document.getElementById("header-nav-log-out");
// boton de cerrar sesion del componente header en mobile
const miniBtnLogout = document.getElementById("mini-nav-modal-log-out");
// tabs de navegación en componente header
const tabHome = document.getElementById("linkHome");
const miniTabHome = document.getElementById("mini-nav-modal-home");

const tabHospital = document.getElementById("linkHospital");
const miniTabHospital = document.getElementById("mini-nav-modal-hospital");

const tabSearch = document.getElementById("linkSearch");
const miniTabSearch = document.getElementById("mini-nav-modal-search");

const tabProfileUser = document.getElementById("linkProfileUser");
const miniTabProfileUser = document.getElementById("mini-nav-modal-profile-user");

const sectionHome = document.getElementById("section-home");

const sectionHospital = document.getElementById("section-hospital");
const tableHospital = document.getElementById("table-hospital");

let listHospital = null; //contenedor de hospitales

const sectionSearch = document.getElementById("section-search");
const tableHospitalSearch = document.getElementById("table-hospital-search");
const searchName = document.getElementById("search-by-name");
const selectDistrito = document.getElementById("distrito");

const sectionProfileUser = document.getElementById("section-profile-user");



// FUNCIÓN PARA EL MENÚ DESPLEGABLE
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
});





















// post
const postUser = document.querySelectorAll("#textarea-post-user");
const btnPublic = document.querySelectorAll("#btn-publicar");
const bodyPostInicio = document.getElementById("section_posts");
const bodyPostProfile = document.getElementById("section_posts_profile");
const selectPrivacity = document.getElementById("select-privacity");
const selectPrivacityProfile = document.getElementById("select-privacity-profile");
let bodyPosts;
let privacityPost = null;
let ref_ = '';


// funciones firebase

//FUNCION PARA CREAR POST Y GUARDAR EN DATABASE DE FIREBASE
const makePost = (postUserTxt) => {
  const x = firebase.auth().currentUser;
  let datePosted = new Date();
  let posts = {
    created_at: datePosted,
    description: postUserTxt.value,
    uid: x.uid,
    privacity: privacityPost
  }
  const key = firebase.database().ref().child('users').push().key;
  posts.idPost = key;
  let updates = {};
  updates['/post/' + key] = posts;
  updates['/users/' + x.uid + '/posts/' + key] = posts;
  firebase.database().ref().update(updates)
};

window.onload = () => {
  mostrarAllPost();
  setTimeout(() => {
    mostrarAllPostPorfile();
  }, 1500)
}
// FUNCION PARA MOSTRAR POST EN INTERFAZ
const mostrarAllPost = () => {
  let cont = 0;
  let ref = firebase.database().ref('/post');
  ref.on('child_added', (newPost) => {
    //bodyPostInicio.innerHTML = '';
    let post = newPost.val();
    let x = firebase.auth().currentUser,
      uuid = x.uid;
    firebase.database().ref('/users/' + post.uid).once('value').then((snapshot) => {
      cont++;
      var username = (snapshot.val().username) || 'Anonymous';
      bodyPostInicio.innerHTML = `
      <div id="${post.idPost}">
        <div class="col s12">
          <div class="card">
            <div class="card-content black-text">
              <div class="col s12 m6 right">
                <a class="dropdown-trigger right" href="#" data-target="dropdown${cont}">
                  <i class="material-icons left ${uuid == post.uid ? "dblock" : "dnone"}">more_vert</i>
                </a>
                <ul id="dropdown${cont}" class="dropdown-content">
                  <li data-idpost="${post.idPost}" data-iduser="${post.uid}" onclick="editPost(this, '#section_posts') ">
                    <a >
                      <i class="material-icons">mode_edit</i>Editar</a>
                  </li >
                  <li data-idpost="${post.idPost}" data-iduser="${post.uid}" onclick="deletePost(this, '#section_posts')">
                    <a>
                      <i class="material-icons">delete</i>Eliminar</a>
                  </li>
                </ul>
              </div>
              <span class="card-title">${username}</span>
              <p class="${post.idPost}">
                ${post.description}
              </p>
              <textarea class="dnone materialize-textarea ${post.idPost}" row="2">${post.description}</textarea>
            </div>
            <div class="card-action">
              <a class="heart">
                <i class="material-icons ${post.idPost}" onclick="likePost(this)" style="${post.whoMakeLikes ? post.whoMakeLikes[uuid] ? 'color:red' : 'color:#ffab40' : null}">favorite_border</i>
              </a>
              <a class="post-likes">${post.countLike ? post.countLike : 0}</a>
              <a id="${post.idPost}" onclick="savePost(this, '#section_posts')" class="dnone waves-effect waves-light btn">
                <i class="mdi-maps-rate-review left">Guardar</i>
              </a>
            </div>
          </div>
        </div>
      </div>
  ` + bodyPostInicio.innerHTML;
      let elems = document.querySelectorAll('#section_posts .dropdown-trigger');
      M.Dropdown.init(elems);
    });
  });
  ref.on('child_changed', data => {
    let postIdToUpdate = data.val().idPost;
    let uuid = firebase.auth().currentUser.uid;
    let postP = document.querySelector("#section_posts_profile p." + postIdToUpdate),
      postTextArea = document.querySelector("#section_posts_profile textarea." + postIdToUpdate),
      postLikeCounter = document.querySelector("#section_posts_profile div#" + postIdToUpdate + " a.post-likes"),
      heartLike = document.querySelector("#section_posts_profile i." + postIdToUpdate);

    postP.innerText = data.val().description;
    postTextArea.innerHTML = data.val().description;
    postLikeCounter.innerText = data.val().countLike || 0;
    data.val().whoMakeLikes ? data.val().whoMakeLikes[uuid] ? heartLike.style.cssText = "color:red;" : heartLike.style.cssText = "color:#ffab40;" : heartLike.style.cssText = "color:#ffab40;";

  });
  ref.on('child_removed', (data) => {
    let postBlock = document.querySelector("#section_posts_profile div#" + data.val().idPost);
    postBlock.parentNode.removeChild(postBlock);
  })
}

const mostrarAllPostPorfile = () => {
  let x__ = firebase.auth().currentUser;
  ref_ = '/users/' + x__.uid + '/posts'
  let cont = 0;
  let ref = firebase.database().ref(ref_);



  ref.on('child_added', (newPost) => {
    let post = newPost.val();
    let x = firebase.auth().currentUser,
      uuid = x.uid;
    firebase.database().ref('/users/' + post.uid).once('value').then((snapshot) => {

      let username = (snapshot.val().username) || 'Anonymous';
      cont++;
      bodyPostProfile.innerHTML = `
      <div id="${post.idPost}">
        <div class="col s12 m12">
          <div class="card">
            <div class="card-content black-text">
              <div class="col s12 m6 right">
                <a class="dropdown-trigger right" href="#" data-target="dropdowns${cont}">
                  <i class="material-icons left ${uuid == post.uid ? "dblock" : "dnone"}">more_vert</i>
                </a>
                <ul id="dropdowns${cont}" class="dropdown-content">
                  <li data-idpost="${post.idPost}" data-iduser="${post.uid}" onclick="editPost(this, '#section_posts_profile') ">
                    <a >
                      <i class="material-icons">mode_edit</i>Editar</a>
                  </li >
                  <li data-idpost="${post.idPost}" data-iduser="${post.uid}" onclick="deletePost(this, '#section_posts_profile')">
                    <a>
                      <i class="material-icons">delete</i>Eliminar</a>
                  </li>
                </ul>
              </div>
              <span class="card-title">${username}</span>
              <p class="${post.idPost}">
                ${post.description}
              </p>
              <textarea class="dnone materialize-textarea ${post.idPost}" row="2">${post.description}</textarea>
            </div>
            <div class="card-action">
              <a class="heart">
                <i class="material-icons ${post.idPost}" onclick="likePost(this)" style="${post.whoMakeLikes ? post.whoMakeLikes[uuid] ? 'color:red' : 'color:#ffab40' : null}">favorite_border</i>
              </a>
              <a class="post-likes">${post.countLike ? post.countLike : 0}</a>
              <a>Comentario</a>
              <a id="${post.idPost}" onclick="savePost(this, '#section_posts_profile')" class="dnone waves-effect waves-light btn">
                <i class="mdi-maps-rate-review left">Guardar</i>
              </a>
            </div>
          </div>
        </div>
      </div>
  ` + bodyPostProfile.innerHTML;

      let elems_profile = document.querySelectorAll('#section_posts_profile .dropdown-trigger');
      M.Dropdown.init(elems_profile);

    });
  });
  ref.on('child_changed', data => {
    let postIdToUpdate = data.val().idPost;
    let uuid = firebase.auth().currentUser.uid;
    let postP = document.querySelector("#section_posts p." + postIdToUpdate),
      postTextArea = document.querySelector("#section_posts textarea." + postIdToUpdate),
      postLikeCounter = document.querySelector("#section_posts div#" + postIdToUpdate + " a.post-likes"),
      heartLike = document.querySelector("#section_posts i." + postIdToUpdate);

    postP.innerText = data.val().description;
    postTextArea.innerHTML = data.val().description;
    postLikeCounter.innerText = data.val().countLike || 0;
    data.val().whoMakeLikes ? data.val().whoMakeLikes[uuid] ? heartLike.style.cssText = "color:red;" : heartLike.style.cssText = "color:#ffab40;" : heartLike.style.cssText = "color:#ffab40;";

  });
  ref.on('child_removed', (data) => {
    let postBlock = document.querySelector("#section_posts div#" + data.val().idPost);
    postBlock.parentNode.removeChild(postBlock);
  })
}
// FUNCION QUE PERMITE ELIMINAR POST
const deletePost = (post, sectionid) => {
  let postId = post.dataset.idpost,
    postBlock = document.querySelector(sectionid + " div#" + postId);
  const x = firebase.auth().currentUser;
  let updates = {};
  updates['/post/' + postId] = null;
  updates['/users/' + x.uid + '/posts/' + postId] = null;
  //Aparece mensaje de confirmación para eliminiacion del mensaje
  swal({
      title: "¿Está seguro que desea eliminar esta publicación?",
      text: "Puedes editar esta publicación si quieres cambiar algo.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        firebase.database().ref().update(updates, (error) => {
          if (error) {
            alert("No se pudo eliminar")
          } else {
            swal("Tu archivo ha sido eliminado.", {
              icon: "success",
            });
          }
        });
      }
    });
}

// FUNCION QUE PERMITE EDITAR PUBLICACION
const editPost = (post, sectionid) => {
  const x = firebase.auth().currentUser;
  // let idpost = post.idPost;
  let postId = post.dataset.idpost;
  postP = document.querySelector(sectionid + " p." + postId),
    saveButton = document.querySelector(sectionid + " a#" + postId),
    postTextArea = document.querySelector(sectionid + " textarea." + postId);
  //mostrar text area y oculpar p tag
  postP.style.display = "none";
  postTextArea.style.display = "block";
  saveButton.style.display = "inline-block";
}

// FUNCION QUE PERMITE GUARDAR  EN FIREBASE PUBLICACION EDITADA
const savePost = (post, sectionid) => {
  let postId = post.attributes["0"].value,
    newPost = document.querySelector(sectionid + " textarea." + postId).value;
  const x = firebase.auth().currentUser;
  let dateUpdated = new Date();

  let updates = {};
  updates['/post/' + postId + '/updated_at'] = dateUpdated;
  updates['/post/' + postId + '/description'] = newPost;
  updates['/users/' + x.uid + '/posts/' + postId + '/description'] = newPost;
  updates['/users/' + x.uid + '/posts/' + postId + '/updated_at'] = dateUpdated;
  firebase.database().ref().update(updates, (error) => {
    if (error) {
      alert("Ocurrio un error, intentelo mas tarde!");
    } else {
      let postP = document.querySelector(sectionid + " p." + postId),
        saveButton = document.querySelector(sectionid + " a#" + postId),
        posTextArea = document.querySelector(sectionid + " textarea." + postId);
      postP.innerText = newPost;
      posTextArea.innerHTML = newPost;
      postP.style.display = "block";
      posTextArea.style.display = "none";
      saveButton.style.display = "none";
    }
  })
}

const likePost = (favorite) => {
  const x = firebase.auth().currentUser;
  firebase.database().ref('/post/' + favorite.classList[1] + '/whoMakeLikes/' + x.uid).once('value').then((like) => {
    var is_liked = (like.val() && like.val().uid) || 'undefined';
    if (is_liked == 'undefined') {
      let cantLikes = parseInt(favorite.parentNode.nextElementSibling.innerText) + 1;
      let whoMakeLikes = {
        fecha: new Date(),
        uid: x.uid
      }
      updates = {};
      updates['/post/' + favorite.classList[1] + '/countLike'] = cantLikes;
      updates['/post/' + favorite.classList[1] + '/whoMakeLikes/' + x.uid] = whoMakeLikes;
      updates['/users/' + x.uid + '/posts/' + favorite.classList[1] + '/countLike'] = cantLikes;
      updates['/users/' + x.uid + '/posts/' + favorite.classList[1] + '/whoMakeLikes/' + x.uid] = whoMakeLikes;
      firebase.database().ref().update(updates, (error) => {
        if (error) {
          alert("Ocurrio un error, intentelo mas tarde!");
        } else {
          favorite.style.color = "red";
          favorite.parentNode.nextElementSibling.innerText = cantLikes;
        }
      });
    } else {
      let cantLikes = parseInt(favorite.parentNode.nextElementSibling.innerText) - 1;
      updates = {};
      updates['/post/' + favorite.classList[1] + '/countLike'] = cantLikes;
      updates['/post/' + favorite.classList[1] + '/whoMakeLikes/' + x.uid] = null;
      updates['/users/' + x.uid + '/posts/' + favorite.classList[1] + '/countLike'] = cantLikes;
      updates['/users/' + x.uid + '/posts/' + favorite.classList[1] + '/whoMakeLikes/' + x.uid] = null;
      firebase.database().ref().update(updates, (error) => {
        if (error) {
          alert("Ocurrio un error, intentelo mas tarde!");
        } else {
          favorite.style.color = "#ffab40";
          favorite.parentNode.nextElementSibling.innerText = cantLikes;
        }
      });
    }
  })

}




tabProfileUser.addEventListener("click", () => tabProfileUserDescription());

miniTabProfileUser.addEventListener("click", () => tabProfileUserDescription());

// boton de publicar un post


btnPublic[0].addEventListener("click", () => {
  privacityPost = null;
  if (postUser[0].value !== "") {
    if (selectPrivacity.options[selectPrivacity.selectedIndex].value == "") {
      privacityPost = "public";
      makePost(postUser[0]);
      postUser[0].value = "";
    } else {
      privacityPost = selectPrivacity.options[selectPrivacity.selectedIndex].value;
      makePost(postUser[0]);
      postUser[0].value = "";
    }
  }
});

btnPublic[1].addEventListener("click", () => {
  privacityPost = null;
  if (postUser[1].value !== "") {
    if (selectPrivacityProfile.options[selectPrivacityProfile.selectedIndex].value == "") {
      privacityPost = "public";
      makePost(postUser[1]);
      postUser[1].value = "";
    } else {
      privacityPost = selectPrivacityProfile.options[selectPrivacityProfile.selectedIndex].value;
      makePost(postUser[1]);
      postUser[1].value = "";
    }
  }
});








// funciones

const showElementTab = (element) => {
  element.style.display = "block";
  element.className += " active";
}

const hideElementsTab = (arr) => {
  arr.forEach(element => {
    element.style.display = "none";
    let classes = element.className.replace("active", "");
    element.className = classes;
  });
}

const sortHospitalByDistrit = (distrito) => {
  const newListHospital = listHospital.filter(hospital => hospital.distrito === distrito);
  const byDistrit = newListHospital.sort((a, b) => {
    let x = a.distrito.toLowerCase();
    let y = b.distrito.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  return byDistrit;
}

const orderByDistritSort = (name_distrito) => {
  tableHospitalSearch.innerHTML = "";
  const distrit = sortHospitalByDistrit(name_distrito);
  distrit.map(hospital => {
    tableHospitalSearch.innerHTML += `
    <tr>
      <td>${hospital.clinica}</td>
      <td>${hospital.direccion}</td>
      <td>${hospital.distrito}</td>
    </tr>
    `;
  });
}

const switchDistrito = (distrito) => {
  switch (distrito) {
    case 'san-isidro':
      orderByDistritSort("San Isidro");
      break;
    case 'miraflores':
      orderByDistritSort("Miraflores");
      break;
    case 'surco':
      orderByDistritSort("Surco");
      break;
    case 'pueblo-libre':
      orderByDistritSort("Pueblo Libre");
      break;
    case 'lima':
      orderByDistritSort("Lima");
      break;
    case 'san-borja':
      orderByDistritSort("San Borja");
      break;
    case 'smp':
      orderByDistritSort("S.M.P.");
      break;
    case 'molina':
      orderByDistritSort("La Molina");
      break;
    case 'callao':
      orderByDistritSort("Callao");
      break;
    case 'breña':
      orderByDistritSort("Breña");
      break;
    case 'sjl':
      orderByDistritSort("San Juan de Lurigancho");
      break;
    case 'san-miguel':
      orderByDistritSort("San Miguel");
      break;
    case 'independencia':
      orderByDistritSort("Independencia");
      break;
    case 'sjm':
      orderByDistritSort("San Juan De Miraflores");
      break;
    case 'cañete':
      orderByDistritSort("Cañete");
      break;
    case 'jesus-maria':
      orderByDistritSort("Jesús María");
      break;
    case 'surquillo':
      orderByDistritSort("Surquillo");
      break;
    case 'chorrilos':
      orderByDistritSort("Chorrillos");
      break;
    case 'san-luis':
      orderByDistritSort("San Luis");
      break;
    case 'los-olivos':
      orderByDistritSort("Los Olivos");
      break;
    case 'lince':
      orderByDistritSort("Lince");
      break;
    default:
      break;
  }
}

const searchByName = (hospitales, text) => {
  let filterByHospital = hospitales.filter(hospital => {
    return hospital.clinica.toUpperCase().indexOf(text.toUpperCase()) > -1;
  });
  return filterByHospital;
}

const showHospitalList = (list, e) => {
  if (e === "linkHospital" || e === "mini-nav-modal-hospital") {
    list.map(hospital => {
      tableHospital.innerHTML += `
      <tr>
        <td>${hospital.clinica}</td>
        <td>${hospital.direccion}</td>
        <td>${hospital.distrito}</td>
      </tr>
      `;
    });
  } else if (e === "linkSearch" || e === "mini-nav-modal-search") {
    tableHospitalSearch.innerHTML = "";
    list.map(hospital => {
      tableHospitalSearch.innerHTML += `
      <tr>
        <td>${hospital.clinica}</td>
        <td>${hospital.direccion}</td>
        <td>${hospital.distrito}</td>
      </tr>
      `;
    });
  } else {
    const filterHospital = searchByName(list, e);
    tableHospitalSearch.innerHTML = "";
    filterHospital.map(hospital => {
      tableHospitalSearch.innerHTML += `
      <tr>
        <td>${hospital.clinica}</td>
        <td>${hospital.direccion}</td>
        <td>${hospital.distrito}</td>
      </tr>
      `;
    })
  }
}

const getHospital = (e) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '../data/hospitales.json', true);
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let xhrHospital = JSON.parse(xhr.responseText);
      listHospital = xhrHospital;
      if (e === "linkHospital" || e === "mini-nav-modal-hospital" || e === "linkSearch" || e === "mini-nav-modal-search") {
        showHospitalList(xhrHospital, e);
      } else {
        showHospitalList(xhrHospital, e);
      }
    }
  }
  xhr.send();
}

const tabHomeDescription = () => {
  hideElementsTab([sectionSearch, sectionHospital, sectionProfileUser]);
  // mostrarAllPost();
  showElementTab(sectionHome);
}

const tabHospitalDescription = (e) => {
  sectionHospital.style.display = "block";
  sectionHome.style.display = "none";
  sectionProfileUser.style.display = "none";
  sectionSearch.style.display = "none";
  getHospital(e);
}

const tabSearchDescription = (e) => {
  sectionSearch.style.display = "block";
  sectionHospital.style.display = "none";
  sectionHome.style.display = "none";
  sectionProfileUser.style.display = "none";
  getHospital(e);
}

const tabProfileUserDescription = () => {
  hideElementsTab([sectionHospital, sectionHome, sectionSearch])
  showElementTab(sectionProfileUser);
}






// acciones de botones

logOut.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = '../../src/'
  })
});

miniBtnLogout.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = '../../src/'
  })
});

tabHome.addEventListener("click", () => tabHomeDescription());
miniTabHome.addEventListener("click", () => tabHomeDescription());

tabHospital.addEventListener("click", (e) => tabHospitalDescription(e.currentTarget.id));
miniTabHospital.addEventListener("click", (e) => tabHospitalDescription(e.currentTarget.id));

miniTabSearch.addEventListener("click", (e) => tabSearchDescription(e.currentTarget.id));
tabSearch.addEventListener("click", (e) => tabSearchDescription(e.currentTarget.id));
searchName.addEventListener("input", (e) => getHospital(e.target.value)); //input para buscar el nombre del hospital
selectDistrito.addEventListener("change", () => switchDistrito(selectDistrito.options[selectDistrito.selectedIndex].value));

