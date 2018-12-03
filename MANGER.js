var BOUF_URL = "https://fr.openfoodfacts.org/cgi/search.pl";
var LIMIT_BOUF = 35;
var OFFSET_BOUF = 1;


$(document).keypress(function(e){
	if(e.which == 13){
		searchBouf();
	}
});


$(window).scroll(function(){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 20){
		OFFSET_BOUF++;
		searchBouf(true);
	}
});

function searchBouf(){
    var query = $("#search > input").val();

	if(!query.trim()){
		alert("MET DES MOTS !");
		return;
	}


	$.get(BOUF_URL + "?search_simple=1&action=process&json=1&page_size=" + LIMIT_BOUF + "&page="+ OFFSET_BOUF +"&search_terms=" + query, function(data,status){

		var bouf = data.products;

		if(bouf.length <= 0){
			alert("ERROR ! no data found");
			return;
		}

		for(var i = 0; i < bouf.length; i++){
			var produit = bouf[i];
            var previewUrl = produit.image_url;
            var name = produit.product_name;
            var brand = produit.brands;
            var country = produit.manufacturing_places;
            var nutriGrade = produit.nutrition_grades;
            var novaGroupe = produit.nova_groups;
            var nutriScore;
            var novaScore;
            var bioOrNot = produit.labels;
            var bio = 0;
            var couleur;
            var url = produit.url;

           
            if(bioOrNot == "en:organic"){
                bio = 1;
            }


            if (nutriGrade  == "a"){
                nutriScore = 5 * 0.6;
            }
            else if(nutriGrade  == "b"){
                nutriScore = 4 * 0.6;
            }
            else if(nutriGrade  == "c"){
                nutriScore = 3 * 0.6;
            }
            else if(nutriGrade  == "d"){
                nutriScore = 2 * 0.6;
            }
            else{
                nutriScore = 1 * 0.6;
            }

            if (novaGroupe  == 4){
                novaScore = 1 * 0.3;
            }
            else if(novaGroupe  == 3){
                novaScore = 2 * 0.3;
            }
            else if(novaGroupe  == 2){
                novaScore = 3 * 0.3;
            }
            else {
                novaScore = 4 * 0.3;
            }
            

            if (produit.nutrition_score_debug == "no nutriscore for category en:waters"){
                score = 100;
            }
            else if(produit.pnns_groups_2 == "Alcoholic beverages" || !nutriGrade || !novaGroupe){ //pas d'exemple de produits sans notes nova nutri
                score = "PAS DE NOTE";
            }
            else{
                var score = Math.floor(((nutriScore/5) + (novaScore/3) + (bio * 0.1))*100);
            }

            if (score < 30){
                couleur = "rouge";
            }
            else if (score >= 30 && score < 45){
                couleur = "orange";
            }
            else if (score >= 45 && score < 60){
                couleur = "jaune";
            }
            else if(score >= 60) {
                couleur = "vert";
            }
            else{
                couleur = "gris";
            }

            /*console.log(previewUrl);
            console.log(name);
            console.log(brand);
            console.log(country);
            console.log(score);
            console.log(couleur);
            console.log(url)*/
			$("#manger").append("<div class = "+ couleur +"> <a href="+url+" target=_blank><img src='"+previewUrl+"' class='food'></a> <p>"+name+"</p> <p>"+brand+"</p><p>"+score+"/100</p></div>");
		}
	})
}