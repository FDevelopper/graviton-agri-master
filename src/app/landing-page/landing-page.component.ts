declare var require: any;
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {} from '../../assets/build';
import * as THREE from 'three';

const STLLoader = require('three-stl-loader')(THREE);


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  scene = null;
  camera = null;
  cameraTarget = null;
  loader = null;

  constructor() {

    this.camera = new THREE.PerspectiveCamera(16, window.innerWidth / window.innerHeight);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.scene = new THREE.Scene();

    this.loader = new STLLoader();
    this.loader.load('/assets/logo3d.stl',  (geometry) => {
      const material = new THREE.MeshPhongMaterial({color: 0xF35F15, specular: null, shininess: 50});
      material.transparent = true;
      material.opacity = 0.8;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(0.035, 0.02, 0.02);
      this.scene.add(mesh);
    });

    // Lights
    this.scene.add(new THREE.HemisphereLight(0x212121, 0x111122));
    this.addShadowedLight(1, 1, -1, 0xEDECEC, 1);
    this.addShadowedLight(1, 1, 1, 0xF69E6E, 1);
    this.addShadowedLight(-1, 1, 1, 0xF69E6E, 1);
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth / 8, window.innerHeight / 5.4);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());
    const timer = Date.now() * 0.001;
    this.camera.position.x = Math.cos(timer) * 3;
    this.camera.position.z = Math.sin(timer) * 3;
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  ngOnInit() {
  }

   @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
     this.camera.aspect = window.innerWidth / window.innerHeight;
     this.camera.updateProjectionMatrix();
     this.renderer.setSize( window.innerWidth / 8, window.innerHeight / 5.4);
    }

  addShadowedLight(x, y, z, color, intensity) {
   const directionalLight = new THREE.DirectionalLight(color, intensity);
   directionalLight.position.set(x, y, z);
   this.scene.add(directionalLight);
   directionalLight.castShadow = true;
    const d = 1;
   directionalLight.shadow.camera.left = -d;
   directionalLight.shadow.camera.right = d;
   directionalLight.shadow.camera.top = d;
   directionalLight.shadow.camera.bottom = -d;
   directionalLight.shadow.camera.near = 1;
   directionalLight.shadow.camera.far = 4;
   directionalLight.shadow.mapSize.width = 1024;
   directionalLight.shadow.mapSize.height = 1024;
   directionalLight.shadow.bias = -0.002;
 }

}
