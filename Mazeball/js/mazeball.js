'use strict';

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/ammo.js';

// variables pour les éléments initiaux essentiels
var renderer, scene, camera, light, loader, controller;

var fallcube, ground, sphere, finalGroundPiece;

var firstRoll = null;
var firstPitch = null;
var frameCounter = 0;

// variable pour le nombre de vies
var lives = 3;


/**
 * Initialise la scène
 */
function initScene()
{
    // Créer le gestionnaire de rendu
    renderer = new THREE.WebGLRenderer();

    // Definir la taille de la fenêtre de rendu
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Placer la fenêtre de rendu dans la page
    document.body.appendChild(renderer.domElement);
    
    createScene();

    createCamera();

    // Gerer le redimensionnement de la fenêtre
    THREEx.WindowResize(renderer, camera);

    createLight();

    // Instancier la classe qui charge les textures des objets
    loader = new THREE.TextureLoader();

    createFallcube();

    createGround();

    createSphere();

    // Faire le rendu de tout ça
    requestAnimationFrame( render );
    scene.simulate();

	// Gestion des touches
    document.onkeydown = function(e)
    {
        switch(e.which)
        {
            case 70:
                // Touche "f" : Plein écran
                toggleFullScreen();
                break;

            case 82:
                // Touche "r" : Reset
                resetLives();
                resetScene();
                break;

            case 37:
                // Fleche gauche
                changeGroundRotation(0.01, 0);
                break;

            case 38:
                // Fleche haut
                changeGroundRotation(0, 0.01);
                break;

            case 39:
                // Fleche droit
                changeGroundRotation(-0.01, 0);
                break;

            case 40:
                // Fleche bas
                changeGroundRotation(0, -0.01);
        } 
    };

    setupController();
};

/**
 * Crée la scène
 */
function createScene()
{
    // Création de la scène
    scene = new Physijs.Scene;

    // Definir la gravité de la scène
    scene.setGravity( new THREE.Vector3(0, -100, 0) );

    // Refaire la simulation de la scène à chaque mise à jour
    scene.addEventListener(
        'update',
        function()
        {
            scene.simulate(undefined, 1);
        }
    );
}

/**
 * Crée la caméra, la vue à travers laquelle l'utilisateur voit la scène
 */
function createCamera()
{
    // Créer la caméra
    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    // Definir la position de la caméra
    camera.position.set(70, 70, 0);

    // Faire regarder la position de la scène
    camera.lookAt(scene.position);

    // Ajouter la caméra à la scène
    scene.add(camera);
}

/**
 * Crée la lumière qui éclaire la scène
 */
function createLight()
{
    // Création d'une source de lumière
    light = new THREE.DirectionalLight(0xFFFFFF);

    // Definir la position de la source de lumière
    light.position.set(20, 40, -15);
    light.target.position.copy(scene.position);

    // Ajouter la source de lumière à la scène
    scene.add(light);
}    

/**
 * Crée un cube qui est utilisé pour detecter les chutes de la sphère du plateau
 */
function createFallcube()
{	
	// Création du materiau du fallcube
	var fallcubeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#000000"} )
    );
	
	// Geometrie du fallcube
	var fallcubeGeometry = new THREE.BoxGeometry(500, 1, 500);
	
	// Création du fallcube
	fallcube = new Physijs.BoxMesh(fallcubeGeometry, fallcubeMaterial, 0);
	
	// Definition de la position pour le mettre sous le plateau de jeu
    fallcube.position.set(0, -100, 0);

	// Ajouter à la scène
    scene.add(fallcube);
}

/**
 * Crée le "sol", le plateau de jeu
 */
function createGround()
{
	// Création du materiau du sol
	var groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#003399"} ),
        .8, // high friction
        .4 // low restitution
    );
	
	// Geometrie du sol
    var groundGeometry = new THREE.BoxGeometry(5, 1, 5);
	
	// Création du sol
	ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	
	// Creation de la geometrie des cases fines
	var thinGroundPieceGeometry = new THREE.BoxGeometry(1, 1, 5);
	
	// Creation de la geometrie de la case rotative
	var spinningGroundPieceGeometry = new THREE.CylinderGeometry( 5, 5, 1, 32 );
	
	// Création du materiau de la case gagnante
	var finalGroundPieceMaterial = new THREE.MeshLambertMaterial({color: "#ff9933"});
	
	var groundPiece;
	var groundPiecePositions = [
		[5, 0, 0],
		[10, 0, 0],
		[15, 0, 0],
		[15, 0, 5],
		[15, 0, 10],
		[10, 0, 10],
		[5, 0, 10],
		[0, 0, 10],
		[-5, 0, 10],
		[-10, 0, 10],
		[-10, 0, 5],
		[-10, 0, 0],
		[-10, 0, -5],
		[-10, 0, -10],
		[-5, 0, -10],
		[0, 0, -10],
		[5, 0, -10],
		[10, 0, -10],
		[15, 0, -10],
		[20, 0, -10],
		[25, 0, -10],
		[25, 0, -5],
		[25, 0, 0],
		[25, 0, 5],
		[25, 0, 10],
		[25, 0, 15],
		[25, 0, 20],
		[25, 0, 25],
		[25, 0, 30],
		[20, 0, 30],
		[15, 0, 30],
		[15, 0, 25],
		[15, 0, 20],
		[10, 0, 20],
		[5, 0, 20],
		[5, 0, 25],
		[5, 0, 30],
		[0, 0, 30],
		[-5, 0, 30],
		[-5, 0, 25],
		[-5, 0, 20],
		[-10, 0, 20],
		[-15, 0, 20],
		[-20, 0, 20],
		[-20, 0, -20],
		[-15, 0, -20],
		[-10, 0, -20],
		[-5, 0, -20],
		[-5, 0, -25],
		[-5, 0, -30],
		[0, 0, -30],
		[5, 0, -30],
		[10, 0, -30],
		[15, 0, -30],
		[20, 0, -30],
		[25, 0, -30],
		[25, 0, -25],
		[25, 0, -20],
		[20, 0, -20],
		[15, 0, -20],
		[10, 0, -20]
	];
	
	var thinGroundPiecePositions = [
		[-20, 0, 15],
		[-20, 0, 10],
		[-20, 0, 5],
		[-20, 0, 0],
		[-20, 0, -5],
		[-20, 0, -10],
		[-20, 0, -15]
	];
	
	var finalGroundPiecePosition = [5, 0, -20];
	
	// Créer les cases du plateau et les ajouter au plateau
	groundPiecePositions.forEach(function(entry) {
		groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
		groundPiece.position.set(entry[0], entry[1], entry[2]);	
		ground.add(groundPiece);
	});
	
	// Créer les cases fines du plateau et les ajouter au plateau
	thinGroundPiecePositions.forEach(function(entry) {
		groundPiece = new Physijs.BoxMesh(thinGroundPieceGeometry, groundMaterial, 0);
		groundPiece.position.set(entry[0], entry[1], entry[2]);
		ground.add(groundPiece);
	});
	
	// Créer la case finale du plateau et l'ajouter au plateau
	finalGroundPiece = new Physijs.BoxMesh(groundGeometry, finalGroundPieceMaterial, 0);
	finalGroundPiece.position.set(finalGroundPiecePosition[0], finalGroundPiecePosition[1], finalGroundPiecePosition[2]);
	ground.add(finalGroundPiece);
	
	// Ajouter le plateau à la scène
	scene.add(ground);
}

/**
 * Crée la sphère que l'utilisateur controle
 */
function createSphere()
{
	// Création du materiau de la sphere
    var sphereMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#FFFFFF"} ),
        .4, // low friction
        .6 // high restitution
    );
	
	// Geometrie de la sphere
    var sphereGeometry = new THREE.SphereGeometry(2, 15, 15);
	
	// Création de la sphère
    sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);

    // Changement de position de la sphere
    sphere.position.set(0, 15, 0);

	// On attache une fonction qui sera appellé à chaque collision d'un objet avec la sphere
    sphere.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {		
		if(other_object == fallcube)
        {
			// Si l'autre objet est le fallcube, la sphère est tombée du plateau
            playerFell();
        }
    });

    // Ajouter la sphère à la scène
    scene.add(sphere);
}

/**
 * Commence le rendu de la scène
 */
function render()
{
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

/**
 * Remet la calibration de la main à zéro
 */
function resetHandCalibration()
{
	firstRoll = null;
    frameCounter = 0;
}

/**
 * Active / desactive le plein écran
 */
function toggleFullScreen()
{
    if( THREEx.FullScreen.activated() )
    {
        // Plein écran activé, il faut desactiver
        THREEx.FullScreen.cancel();
    }
    else
    {
        // Plein écran desactivé, il faut activer
        THREEx.FullScreen.request();
    }
}

/**
 * Affiche la couche "Game over"
 */
function showGameOver()
{
    document.getElementById("gameOverOverlay").style.visibility = 'visible';
}

/**
 * Cache la couche "Game over"
 */
function hideGameOver()
{
    document.getElementById("gameOverOverlay").style.visibility = 'hidden';
}

/**
 * Appellée lorsque la sphère tombe du plateau
 */
function playerFell()
{
	// Decrementer le nombre de vies du joueur
    decrementLives();
	
	// Remettre la calibration de la main à zéro
    resetHandCalibration();

    if(lives == 0) {
		// Plus de vies... Game over !
        showGameOver();
    } else {
		// Remettre la scène en place
        resetScene();
    }
}

/**
 * Remete la scène à zéro
 */
function resetScene()
{
    setGroundRotation(0, 0, 0);
    setSpherePosition(0, 15, 0);
}

/**
 * Definit la rotation du plateau
 */
function setGroundRotation(x, y, z)
{
    ground.__dirtyRotation = true;

    if(x != null)
    {
		if(x < 0.2 && x > -0.2) {
			ground.rotation.x = x;
		}
    }

    if(y != null)
    {
        ground.rotation.y = y;
    }

    if(z != null)
    {
		if(z < 0.2 && z > -0.2) {
			ground.rotation.z = z;
		}
    }
}

/**
 * Definit la rotation de la sphère
 */
function setSpherePosition(x, y, z)
{
    sphere.__dirtyPosition = true

    if(x != null)
    {
        sphere.position.x = x;
    }

    if(y != null)
    {
        sphere.position.y = y;
    }

    if(z != null)
    {
        sphere.position.z = z;
    }

    // Annuler la velocité de la sphère
    sphere.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    sphere.setAngularVelocity(new THREE.Vector3(0, 0, 0));
}

/**
 * Incremente / decremente la rotation du plateau
 */
function changeGroundRotation(deltaX, deltaZ)
{
    setGroundRotation(ground.rotation.x + deltaX, null, ground.rotation.z + deltaZ);
}


/**
 * Instancie le LeapMotion et fait pencher le plateau
 */
function setupController()
{
    controller = new Leap.Controller( {enableGestures: true} );

    controller.loop(
        function(frame)
        {
            for (var i in frame.handsMap)
            {
                var hand = frame.handsMap[i];

                if(firstRoll == null)
                {
                    if(frameCounter < 25)
                    {
                        return ++frameCounter;
                    }

                    firstRoll = hand.roll() / 8;
                    firstPitch = hand.pitch() / 8;
                    return;
                }

                var roll = hand.roll() / 8 + firstRoll;
                var pitch = -(hand.pitch() / 8) + firstPitch;

                setGroundRotation(roll, 0, pitch);
            }
        }
    );
}

/**
 * Decremente le nombre de vies du joueur
 */
function decrementLives() {
    // Modifier l'image du coeur plein en coeur vide
    document.getElementById("life" + lives).style.visibility = "hidden";

    // Decrementer le nombre de vies
    lives--;
}

/**
 * Remettre le nombre de vies du joueur à zéro
 */
function resetLives() {
    hideGameOver();

    // Remettre les images en coeur plein
    document.getElementById("life1").style.visibility = "visible";
    document.getElementById("life2").style.visibility = "visible";
    document.getElementById("life3").style.visibility = "visible";

    // Remettre le nombre de vies à 3
    lives = 3;
}

// Dès que la fenêtre est chargée, appeller la fonction d'initialisation de la scène
window.onload = initScene;