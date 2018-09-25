// header tendra header y los tabs btn salir

headerMenu = `
<nav>
	<img class="center" src="../img/logo.png" alt="Logo">
	<ul id="nav-mobile" class="right hide-on-med-and-down">
	<li>
		<a id="header-nav-log-out" class="right">Cerrar sesión</a>
	</li>
	</ul>
	<ul id="nav-mobile" class="left hide-on-large-only">
	<li>
		<a id="mini-nav-modal-log-out" class="right"><i class="material-icons">exit_to_app</i></a>
	</li>
	</ul>
	<div class="tab">
		<button class="tablink" id="linkHome">Inicio</button>
		<button class="tablink" id="linkHospital">Clínicas - Hospitales</button>
		<button class="tablink" id="linkSearch">Buscar</button>
		<button  class="tablink" id="linkProfileUser">Perfil
		</button>
	</div>
	<div class="tab mini-tab">
		<button class="tablink" id="mini-nav-modal-home"><i class="material-icons">home</i></button>
		<button class="tablink" id="mini-nav-modal-hospital"><i class="material-icons">local_hospital</i></button>
		<button class="tablink" id="mini-nav-modal-search"><i class="material-icons">search</i></button>
		<button class="tablink" id="mini-nav-modal-profile-user"><i class="material-icons">account_circle</i></button>
	</div>
</nav>
`;
