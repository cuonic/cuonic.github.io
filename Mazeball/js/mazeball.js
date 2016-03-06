'use strict';

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'js/ammo.js';

// variables des noms de fonctions
var initScene, render, toggleFullscreen, resetScene, setGroundRotation, setSpherePosition, changeGroundRotation, setupController;

// variables pour les éléments initiaux essentiels
var renderer, scene, camera, light, loader, controller;

// variables pour les matériaux
var groundMaterial, sphereMaterial, fallcubeMaterial;

// variables pour les géométries
var groundGeometry, sphereGeometry, fallcubeGeometry;

// variables pour le texte "Game over"
var gameOverGeometry, gameOverMaterial, gameOver;

// variables pour les éléments du jeu
var ground, sphere, fallcube;

// variable pour le nombre de vies
var lives = 3;

/*
 * Leapmotion
 * Roll < 0 -> droite
 * Roll > 0 -> gauche
 * Pitch < 0 -> bas
 * Pitch > 0 -> haut
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

    createGroundMaterial();

    createSphereMaterial();

    createGeometries();

    createGround();

    createSphere();

    // Faire le rendu de tout ça
    requestAnimationFrame( render );
    scene.simulate();

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
                changeGroundRotation(-0.01, 0);
                break;

            case 38:
                // Fleche haut
                changeGroundRotation(0, 0.01);
                break;

            case 39:
                // Fleche droit
                changeGroundRotation(0.01, 0);
                break;

            case 40:
                // Fleche bas
                changeGroundRotation(0, -0.01);
        } 
    };

    setupController();
};

function createScene()
{
    // Création de la scène
    scene = new Physijs.Scene;

    // Definir la gravité de la scène
    scene.setGravity( new THREE.Vector3(0, -30, 0) );

    // Refaire la simulation de la scène à chaque mise à jour
    scene.addEventListener(
        'update',
        function()
        {
            scene.simulate(undefined, 1);
        }
    );
}

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
    camera.position.set(60, 60, 0);

    // Faire regarder la position de la scène
    camera.lookAt(scene.position);

    // Ajouter la caméra à la scène
    scene.add(camera);
}

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
    
function createGroundMaterial()
{
    // Création du materiau du sol
    groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#003399"} ),
        .8, // high friction
        .4 // low restitution
    );

    fallcubeMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#000000"} )
    );
}
    
function createSphereMaterial()
{
    // Création du materiau de la sphere
    sphereMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial( {color: "#FFFFFF"} ),
        .4, // low friction
        .6 // high restitution
    );
}
    
function createGeometries()
{
    // Geometrie du sol
    groundGeometry = new THREE.BoxGeometry(5, 1, 5);

    fallcubeGeometry = new THREE.BoxGeometry(500, 1, 500);

    // Geometrie de la sphere
    sphereGeometry = new THREE.SphereGeometry(2, 15, 15);
}

function createGround()
{
    // Création du sol
    ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	groundPiece.position.z = 5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 0;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -5;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -5;
	groundPiece.position.z = 15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -10;
	groundPiece.position.z = 15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = 15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = 5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = 0;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = -5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = -15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -10;
	groundPiece.position.z = -15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -5;
	groundPiece.position.z = -15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 0;
	groundPiece.position.z = -15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	groundPiece.position.z = -15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 20;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = -10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = -5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 0;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 5;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 10;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 15;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 20;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 25;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 20;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 15;
	groundPiece.position.z = 20;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 10;
	groundPiece.position.z = 20;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	groundPiece.position.z = 20;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 5;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = 0;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -5;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
	groundPiece.position.x = -10;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	var groundPiece = new Physijs.BoxMesh(groundGeometry, new THREE.MeshLambertMaterial({color: "#ff9933"}), 0);
	groundPiece.position.x = -15;
	groundPiece.position.z = 25;
	ground.add(groundPiece);
	
	groundPiece.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
        console.log(other_object)
		
		if(other_object == sphere)
        {
            youWinOverlay();
        }
    });
	
	
    // Ajouter le sol à la scène
    scene.add(ground);

    fallcube = new Physijs.BoxMesh(fallcubeGeometry, fallcubeMaterial, 0);
    fallcube.position.set(0, -100, 0);

    scene.add(fallcube);
}   

function createSphere()
{
    // Création de la sphère
    sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);

    // Changement de position de la sphere
    sphere.position.set(0, 15, 0);

    sphere.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
        // console.log(other_object)
		
		if(other_object == fallcube)
        {
            playerFell();
        }
    });

    // Ajouter la sphère à la scène
    scene.add(sphere);
}

render = function()
{
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

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

function showGameOver()
{
    document.getElementById("gameOverOverlay").style.visibility = 'visible';
}

function hideGameOver()
{
    document.getElementById("gameOverOverlay").style.visibility = 'hidden';
}

function playerFell()
{
    decrementLives();

    if(getLives() == 0) {
        showGameOver();
    } else {
        resetScene();
    }
}

function resetScene()
{
    setGroundRotation(0, 0, 0);
    setSpherePosition(0, 15, 0);
}

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

function changeGroundRotation(deltaX, deltaZ)
{
    setGroundRotation(ground.rotation.x + deltaX, null, ground.rotation.z + deltaZ);
}

function setupController()
{
    controller = new Leap.Controller( {enableGestures: true} );

    var firstRoll = null;
    var firstPitch = null;
    var frameCounter = 0;

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
                    firstPitch = hand.pitch() / 4;
                    return;
                }

                var roll = hand.roll() / 2 + firstRoll;
                var pitch = -(hand.pitch() / 2) + firstPitch;
                // var pitch = - ( hand.pitch() / 2) +0.06;

                setGroundRotation(roll, 0, pitch);
            }
        }
    );
}

function getLives() {
    return lives;
}

function decrementLives() {
    // Modifier l'image du coeur plein en coeur vide
    document.getElementById("life" + lives).style.visibility = "hidden";

    // Decrementer le nombre de vies
    lives--;
}

function resetLives() {
    hideGameOver();

    // Remettre les images en coeur plein
    document.getElementById("life1").style.visibility = "visible";
    document.getElementById("life2").style.visibility = "visible";
    document.getElementById("life3").style.visibility = "visible";

    // Remettre le nombre de vies à 3
    lives = 3;
}

window.onload = initScene;