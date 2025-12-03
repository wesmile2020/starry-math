import { Box3 } from './Box3';
import { Matrix4 } from './Matrix4';
import { Vector3 } from './Vector3';

/**
 * Represents a ray in 3D space with an origin point and direction vector.
 * A ray extends infinitely in one direction from the origin.
 * @public
 */
class Ray {
  /**
   * Static vector used as temporary storage to avoid memory allocations.
   * @private
   */
  private static readonly _vector = new Vector3();
  /**
   * Static vector for segment center calculation.
   * @private
   */
  private static readonly _segCenter = new Vector3();
  /**
   * Static vector for segment direction calculation.
   * @private
   */
  private static readonly _segDir = new Vector3();
  /**
   * Static vector for difference calculations.
   * @private
   */
  private static readonly _diff = new Vector3();
  /**
   * Static vector for edge calculations in triangle intersections.
   * @private
   */
  private static readonly _edge1 = new Vector3();
  /**
   * Static vector for edge calculations in triangle intersections.
   * @private
   */
  private static readonly _edge2 = new Vector3();
  /**
   * Static vector for normal calculations.
   * @private
   */
  private static readonly _normal = new Vector3();

  /**
   * The origin point of the ray.
   */
  origin: Vector3;

  /**
   * The direction vector of the ray (typically normalized).
   */
  direction: Vector3;

  /**
   * Creates a new Ray instance.
   * @param {Vector3} [origin=new Vector3()] - The origin point of the ray.
   * @param {Vector3} [direction=new Vector3()] - The direction vector of the ray.
   */
  constructor(origin: Vector3 = new Vector3(), direction: Vector3 = new Vector3()) {
    this.origin = origin;
    this.direction = direction;
  }

  /**
   * Sets the origin and direction of this ray.
   * @param {Vector3} origin - The new origin point.
   * @param {Vector3} direction - The new direction vector.
   * @returns {this} This ray instance for method chaining.
   */
  set(origin: Vector3, direction: Vector3): this {
    this.origin = origin;
    this.direction = direction;
    return this;
  }

  /**
   * Computes a point along the ray at parameter t.
   * @param {number} t - The distance parameter along the ray.
   * @param {Vector3} target - The target vector to store the result.
   * @returns {Vector3} The computed point along the ray.
   */
  at(t: number, target: Vector3): Vector3 {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }

  /**
   * Sets the direction of the ray to point from the origin to the given point.
   * The direction vector is automatically normalized.
   * @param {Vector3} v - The point to look at.
   * @returns {this} This ray instance for method chaining.
   */
  lookAt(v: Vector3): this {
    this.direction.copy(v).subtract(this.origin).unit();
    return this;
  }

  /**
   * Moves the origin of the ray along its direction by distance t.
   * @param {number} t - The distance to move the origin.
   * @returns {this} This ray instance for method chaining.
   */
  recast(t: number): this {
    this.origin.copy(this.at(t, Ray._vector));
    return this;
  }

  /**
   * Finds the closest point on the ray to a given point.
   * @param {Vector3} point - The point to find the closest point to.
   * @returns {Vector3} The closest point on the ray.
   */
  closestPointToPoint(point: Vector3): Vector3 {
    const target = point.clone().subtract(this.origin);
    const directionDistance = target.dot(this.direction);

    if (directionDistance < 0) {
      return target.copy(this.origin);
    }

    return target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
  }

  /**
   * Computes the squared distance from the ray to a point.
   * More efficient than distanceToPoint as it avoids the square root operation.
   * @param {Vector3} point - The point to compute distance to.
   * @returns {number} The squared distance from the ray to the point.
   */
  distanceSqToPoint(point: Vector3): number {
    Ray._vector.set(point.x - this.origin.x, point.y - this.origin.y, point.z - this.origin.z);
    const directionDistance = Ray._vector.dot(this.direction);

    if (directionDistance < 0) {
      return this.origin.distanceToSquared(point);
    }
    Ray._vector.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    return Ray._vector.distanceToSquared(point);
  }

  /**
   * Computes the distance from the ray to a point.
   * @param {Vector3} point - The point to compute distance to.
   * @returns {number} The distance from the ray to the point.
   */
  distanceToPoint(point: Vector3): number {
    return Math.sqrt(this.distanceSqToPoint(point));
  }

  /**
   * Computes the squared distance from the ray to a line segment.
   * @param {Vector3} v0 - The first endpoint of the segment.
   * @param {Vector3} v1 - The second endpoint of the segment.
   * @param {Vector3} [pointOnRay] - Optional target vector to store the closest point on the ray.
   * @param {Vector3} [pointOnSegment] - Optional target vector to store the closest point on the segment.
   * @returns {number} The squared distance from the ray to the segment.
   */
  distanceSqToSegment(v0: Vector3, v1: Vector3, pointOnRay?: Vector3, pointOnSegment?: Vector3): number {
    Ray._segCenter.copy(v0).add(v1).multiplyScalar(0.5);
    Ray._segDir.copy(v1).subtract(v0).unit();
    Ray._diff.copy(this.origin).subtract(Ray._segCenter);

    const segExtent = v0.distanceTo(v1) * 0.5;
    const a01 = -this.direction.dot(Ray._segDir);
    const b0 = Ray._diff.dot(this.direction);
    const b1 = -Ray._diff.dot(Ray._segDir);
    const c = Ray._diff.lengthSquared();
    const det = Math.abs(1 - a01 * a01);
    let s0, s1, sqrDist, extDet;

    if (det > 0) {
      s0 = a01 * b1 - b0;
      s1 = a01 * b0 - b1;
      extDet = segExtent * det;
      if (s0 >= 0) {
        if (s1 >= -extDet) {
          if (s1 <= extDet) {
            const invDet = 1 / det;
            s0 *= invDet;
            s1 *= invDet;
            sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
          } else {
            s1 = segExtent;
            s0 = Math.max(0, -(a01 * s1 + b0));
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          }
        } else {
          s1 = -segExtent;
          s0 = Math.max(0, -(a01 * s1 + b0));
          sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
        }
      } else if (s1 <= -extDet) {
        s0 = Math.max(0, -(-a01 * segExtent + b0));
        s1 = (s0 > 0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
      } else if (s1 <= extDet) {
        s0 = 0;
        s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
        sqrDist = s1 * (s1 + 2 * b1) + c;
      } else {
        s0 = Math.max(0, -(a01 * segExtent + b0));
        s1 = (s0 > 0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
      }
    } else {
      // Ray and segment are parallel.
      s1 = (a01 > 0) ? -segExtent : segExtent;
      s0 = Math.max(0, -(a01 * s1 + b0));
      sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
    }

    if (pointOnRay) {
      pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
    }

    if (pointOnSegment) {
      pointOnSegment.copy(Ray._segDir).multiplyScalar(s1).add(Ray._segCenter);
    }

    return sqrDist;
  }

  /**
   * Tests if the ray intersects a box.
   * @param {Box3} box - The box to test intersection with.
   * @returns {Vector3 | null} The intersection point if the ray intersects the box, null otherwise.
   */
  intersectBox(box: Box3): Vector3 | null {
    let tmin, tmax, tymin, tymax, tzmin, tzmax;
    const invdirx = 1 / this.direction.x,
      invdiry = 1 / this.direction.y,
      invdirz = 1 / this.direction.z;

    const origin = this.origin;
    if (invdirx >= 0) {
      tmin = (box.min.x - origin.x) * invdirx;
      tmax = (box.max.x - origin.x) * invdirx;
    } else {
      tmin = (box.max.x - origin.x) * invdirx;
      tmax = (box.min.x - origin.x) * invdirx;
    }

    if (invdiry >= 0) {
      tymin = (box.min.y - origin.y) * invdiry;
      tymax = (box.max.y - origin.y) * invdiry;
    } else {
      tymin = (box.max.y - origin.y) * invdiry;
      tymax = (box.min.y - origin.y) * invdiry;
    }

    if ((tmin > tymax) || (tymin > tmax)) return null;

    // These lines also handle the case where tmin or tmax is NaN
    // (result of 0 * Infinity). x !== x returns true if x is NaN

    if (tymin > tmin) {
      tmin = tymin;
    }

    if (tymax < tmax) {
      tmax = tymax;
    }

    if (invdirz >= 0) {
      tzmin = (box.min.z - origin.z) * invdirz;
      tzmax = (box.max.z - origin.z) * invdirz;
    } else {
      tzmin = (box.max.z - origin.z) * invdirz;
      tzmax = (box.min.z - origin.z) * invdirz;
    }

    if ((tmin > tzmax) || (tzmin > tmax)) return null;

    if (tzmin > tmin) {
      tmin = tzmin;
    }
    if (tzmax < tmax) {
      tmax = tzmax;
    }
    if (tmax < 0) {
      return null;
    }

    return this.at(tmin >= 0 ? tmin : tmax, new Vector3());
  }

  /**
   * Tests if the ray intersects a triangle.
   * References: https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
   * @param {Vector3} a - The first vertex of the triangle.
   * @param {Vector3} b - The second vertex of the triangle.
   * @param {Vector3} c - The third vertex of the triangle.
   * @param {boolean} backfaceCulling - Whether to enable backface culling.
   * @returns {Vector3 | null} The intersection point if the ray intersects the triangle, null otherwise.
   */
  intersectTriangle(a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean): Vector3 | null {
    const diff1 = b.clone().subtract(a);
    Ray._edge1.set(diff1.x, diff1.y, diff1.z);
    const diff2 = c.clone().subtract(a);
    Ray._edge2.set(diff2.x, diff2.y, diff2.z);
    Ray._normal.crossVectors(Ray._edge1, Ray._edge2);

    // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
    // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
    //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
    //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
    //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
    let DdN = this.direction.dot(Ray._normal);
    let sign;

    if (DdN > 0) {
      if (backfaceCulling) {
        return null;
      }
      sign = 1;
    } else if (DdN < 0) {
      sign = -1;
      DdN = -DdN;
    } else {
      return null;
    }

    const diff = this.origin.clone().subtract(a);
    Ray._diff.set(diff.x, diff.y, diff.z);
    const DdQxE2 = sign * this.direction.dot(Ray._edge2.crossVectors(Ray._diff, Ray._edge2));
    // b1 < 0, no intersection
    if (DdQxE2 < 0) {
      return null;
    }

    const DdE1xQ = sign * this.direction.dot(Ray._edge1.cross(Ray._diff));

    // b2 < 0, no intersection
    if (DdE1xQ < 0) {
      return null;
    }

    // b1+b2 > 1, no intersection
    if (DdQxE2 + DdE1xQ > DdN) {
      return null;
    }

    // Line intersects triangle, check if ray does.
    const QdN = -sign * Ray._diff.dot(Ray._normal);

    // t < 0, no intersection
    if (QdN < 0) {
      return null;
    }

    // Ray intersects triangle.
    return this.at(QdN / DdN, new Vector3());
  }

  /**
   * Applies a 4x4 transformation matrix to this ray.
   * @param {Matrix4} matrix4 - The transformation matrix to apply.
   * @returns {this} This ray instance for method chaining.
   */
  applyMatrix4(matrix4: Matrix4): this {
    this.origin.applyMatrix4(matrix4);
    this.direction.transformDirection(matrix4);
    return this;
  }

  /**
   * Checks if this ray is equal to another ray.
   * @param {Ray} ray - The ray to compare with.
   * @returns {boolean} True if the rays are equal, false otherwise.
   */
  equal(ray: Ray): boolean {
    return this.origin.equal(ray.origin) && this.direction.equal(ray.direction);
  }

  /**
   * Copies the origin and direction from another ray.
   * @param {Ray} source - The ray to copy from.
   * @returns {this} This ray instance for method chaining.
   */
  copy(source: Ray): this {
    this.origin.copy(source.origin);
    this.direction.copy(source.direction);
    return this;
  }

  /**
   * Creates a new ray with the same origin and direction as this one.
   * @returns {Ray} A new ray with the same properties.
   */
  clone(): Ray {
    const ray = new Ray();
    ray.copy(this);
    return ray;
  }
}

export { Ray };
