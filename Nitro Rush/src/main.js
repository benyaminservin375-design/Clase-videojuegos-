import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// =====================
// ESCENA
// =====================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x5dade2);

scene.fog = new THREE.Fog(
    0x87ceeb,
    20,
    100
);


// =====================
// CAMARA
// =====================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.set(
    0,
    6,
    10
);


camera.lookAt(
    0,
    0,
    0
);



// =====================
// RENDER
// =====================

const renderer = new THREE.WebGLRenderer({
    antialias:true
});


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document.body.appendChild(
    renderer.domElement
);



// =====================
// LUCES
// =====================

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1
    )
);



const light = new THREE.DirectionalLight(
    0xffffff,
    2
);


light.position.set(
    5,
    10,
    5
);


scene.add(light);



// =====================
// MONTAÑAS
// =====================

function createMountain(x,z,scale){


    const mountain = new THREE.Mesh(

        new THREE.ConeGeometry(
            8,
            15,
            4
        ),


        new THREE.MeshStandardMaterial({
            color:0x666666
        })

    );



    mountain.position.set(
        x,
        7,
        z
    );



    mountain.scale.set(
        scale,
        scale,
        scale
    );


    scene.add(mountain);

}



createMountain(-20,-50,2);
createMountain(20,-60,3);
createMountain(0,-80,2.5);




// =====================
// CARRETERA
// =====================


const road = new THREE.Mesh(

    new THREE.PlaneGeometry(
        10,
        80
    ),


    new THREE.MeshStandardMaterial({
        color:0x333333
    })

);


road.rotation.x = -Math.PI/2;


scene.add(road);




// =====================
// LINEAS DE CARRETERA
// =====================

const roadLines = [];


for(let i=0;i<12;i++){


    [-1.25,1.25].forEach(x=>{


        const line = new THREE.Mesh(

            new THREE.PlaneGeometry(
                0.15,
                4
            ),


            new THREE.MeshStandardMaterial({
                color:0xffffff
            })

        );



        line.rotation.x =
        -Math.PI/2;



        line.position.set(
            x,
            0.02,
            -i*7
        );



        scene.add(line);


        roadLines.push(line);


    });


}



// =====================
// PASTO
// =====================


const grassLeft = new THREE.Mesh(

    new THREE.PlaneGeometry(
        20,
        80
    ),


    new THREE.MeshStandardMaterial({
        color:0x228B22
    })

);



grassLeft.rotation.x=-Math.PI/2;

grassLeft.position.x=-15;


scene.add(grassLeft);




const grassRight = grassLeft.clone();


grassRight.position.x=15;


scene.add(grassRight);




// =====================
// UI
// =====================


let distancia = 0;


const ui=document.createElement("div");


ui.style.position="absolute";
ui.style.top="20px";
ui.style.left="20px";
ui.style.color="white";
ui.style.fontSize="28px";
ui.style.fontFamily="Arial";
ui.style.fontWeight="bold";


document.body.appendChild(ui);




// =====================
// CARRILES
// =====================

const lanes=[

    -2.5,
    0,
    2.5

];


let currentLane=1;



// =====================
// LOADER
// =====================

const loader = new GLTFLoader();




// =====================
// JUGADOR
// =====================


let player;



loader.load(

"/models/carro.glb",


(gltf)=>{


    player=gltf.scene;



    player.scale.set(
        0.50,
        0.50,
        0.50
    );



    player.rotation.y=Math.PI;



    player.position.set(
        0,
        0.3,
        5
    );



    scene.add(player);



}

);





// =====================
// CONTROLES
// =====================


window.addEventListener(
"keydown",
(e)=>{


if(!player)return;



if(e.key.toLowerCase()=="a"){


    currentLane--;


    if(currentLane<0)
    currentLane=0;


}



if(e.key.toLowerCase()=="d"){


    currentLane++;


    if(currentLane>2)
    currentLane=2;


}



player.position.x =
lanes[currentLane];


}

);





// =====================
// CARROS ENEMIGOS
// =====================


const enemyCars=[];



const enemyModels=[

"/models/carroAzul.glb",

"/models/carroRojo.glb",

"/models/carroVerde.glb"

];



let enemyIndex=0;



function createEnemyCar(){



const selectedModel =
enemyModels[enemyIndex];



enemyIndex++;



if(enemyIndex >= enemyModels.length){

    enemyIndex=0;

}




loader.load(

selectedModel,


(gltf)=>{


const car=gltf.scene;



car.scale.set(
0.50,
0.50,
0.50
);



car.rotation.y=10;




car.position.set(


lanes[
Math.floor(
Math.random()*lanes.length
)
],


0.3,


-40 - enemyCars.length * 25



);




scene.add(car);



enemyCars.push({

mesh:car

});



}


);


}




for(let i=0;i<6;i++){

    createEnemyCar();

}

// =====================
// REPOSICIONAR CARROS
// =====================

function resetCar(car){


    car.mesh.position.z =
    -40 - Math.random()*100;



    car.mesh.position.x =
    lanes[
        Math.floor(
            Math.random()*lanes.length
        )
    ];


}



// =====================
// ESTADO DEL JUEGO
// =====================


let gameOver = false;



let roadSpeed = 0.3;

let enemySpeed = 0.15;

let difficultyTimer = 0;




// =====================
// LOOP PRINCIPAL
// =====================


function animate(){


    requestAnimationFrame(animate);




    // =====================
    // MOVER LINEAS
    // =====================


    roadLines.forEach(line=>{


        line.position.z += roadSpeed;



        if(line.position.z > 10){


            line.position.z = -80;


        }


    });






    if(player && !gameOver){



        // =====================
        // DISTANCIA
        // =====================


        distancia += enemySpeed * 0.5;






        // =====================
        // AUMENTAR DIFICULTAD
        // =====================


        difficultyTimer += 0.05;



        if(difficultyTimer > 10){



            enemySpeed += 0.01;


            roadSpeed += 0.01;



            difficultyTimer = 0;



        }





        // =====================
        // MOVER CARROS
        // =====================


        enemyCars.forEach(car=>{



            car.mesh.position.z += enemySpeed;





            // =====================
            // COLISION
            // =====================


            if(

                player.position.distanceTo(
                    car.mesh.position
                )

                < 1.2


            ){



                gameOver = true;




                ui.innerHTML = `


                💥 GAME OVER


                <br><br>


                🏁 Distancia:

                ${Math.floor(distancia)} m



                <br><br>


                💨 Velocidad:

                ${enemySpeed.toFixed(2)}



                <br><br>


                Presiona F5 para reiniciar



                `;


            }






            // =====================
            // RECICLAR CARROS
            // =====================


            if(car.mesh.position.z > 10){


                resetCar(car);


            }



        });






        // =====================
        // UI NORMAL
        // =====================


        if(!gameOver){


            ui.innerHTML = `


            🏁 Distancia:

            ${Math.floor(distancia)} m



            <br>



            💨 Velocidad:

            ${enemySpeed.toFixed(2)}



            `;


        }



    }





    renderer.render(

        scene,

        camera

    );


}



animate();





// =====================
// RESIZE
// =====================


window.addEventListener(

"resize",

()=>{


camera.aspect =

window.innerWidth /

window.innerHeight;



camera.updateProjectionMatrix();



renderer.setSize(

window.innerWidth,

window.innerHeight

);



}

);