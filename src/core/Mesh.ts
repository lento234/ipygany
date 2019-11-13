import * as THREE from 'three';
import * as Nodes from 'three/examples/jsm/nodes/Nodes';

import {
  Effect
} from './Effect';

/**
 * Mesh class
 */
export
class Mesh {

  constructor (vertices: Float32Array, triangleIndices: Uint32Array, tetrahedronIndices: Uint32Array, data: any, defaultColor: string) {
    this.vertices = vertices;
    this.triangleIndices = triangleIndices;
    this.tetrahedronIndices = tetrahedronIndices;
    this.data = data;
    this._defaultColor = defaultColor;
  }

  initialize () : Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.geometry = new THREE.BufferGeometry();
      this.initializeBufferGeometry();

      this.material = new Nodes.StandardNodeMaterial();
      this.material.flatShading = true;
      this.material.side = THREE.DoubleSide;

      // @ts-ignore
      this.material.color = new Nodes.ColorNode(this.defaultColor);

      this.material.build();

      this.mesh = new THREE.Mesh(this.geometry, this.material);

      // Scale up or down the geometry
      this.geometry.computeBoundingSphere();
      const { radius } = this.geometry.boundingSphere;
      this.mesh.scale.set(1 / radius, 1 / radius, 1 / radius);

      this.initialized = true;

      resolve();
    });
  }

  /**
   * Initialize the buffer geometry
   */
  private initializeBufferGeometry () {
    this.vertexBuffer = new THREE.BufferAttribute(this.vertices, 3);
    this.indexBuffer = new THREE.BufferAttribute(this.triangleIndices, 1);

    this.geometry.setAttribute('position', this.vertexBuffer);
    this.geometry.setIndex(this.indexBuffer);
    this.geometry.center();
  }

  /**
   * Update vertices buffers
   */
  updateVertices (vertices: Float32Array) {
    return this.initialize().then(() => {
      this.vertexBuffer.set(vertices);
      this.vertexBuffer.needsUpdate = true;

      this.geometry.center();

      // TODO: Update effects geometries
    });
  }

  set defaultColor (defaultColor: string) {
    this._defaultColor = defaultColor;

    // @ts-ignore
    this.material.color = new Nodes.ColorNode(this.defaultColor);

    this.material.build();
  }

  get defaultColor () : string {
    return this._defaultColor;
  }

  /**
   * Add the mesh to a given scene
   */
  addToScene (scene: THREE.Scene) {
    return this.initialize().then(() => {
      scene.add(this.mesh);
    });
  }

  set scale(scale: THREE.Vector3) {
    this.mesh.scale = scale;
  }

  vertices: Float32Array;
  triangleIndices: Uint32Array;
  tetrahedronIndices: Uint32Array;
  data: any;
  private _defaultColor: string;

  geometry: THREE.BufferGeometry;
  private vertexBuffer: THREE.BufferAttribute;
  private indexBuffer: THREE.BufferAttribute;

  material: Nodes.StandardNodeMaterial;

  private mesh: THREE.Mesh;

  effects: Effect[];

  private initialized: boolean = false;

}
