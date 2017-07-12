$(document).ready(()=>{
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var confirmation = confirm('Tem certeza que quer deletar este usuário?');

	if (confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		window.location.replace('/');
	} else{
		return false;
	}
}
