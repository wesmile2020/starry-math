import { Vector3 } from './Vector3';

/**
 * Represents an axis-aligned bounding box (AABB) in 3D space.
 * The box is defined by its minimum and maximum corner points.
 * @public
 */
class Box3 {
  /**
   * The minimum point of the box, representing the corner with smallest coordinates.
   */
  min: Vector3;

  /**
   * The maximum point of the box, representing the corner with largest coordinates.
   */
  max: Vector3;

  /**
   * Creates a new Box3 bounding box
   * @param min - Minimum point defining the bounding box. Defaults to a new Vector3() (0, 0, 0)
   * @param max - Maximum point defining the bounding box. Defaults to a new Vector3() (0, 0, 0)
   */
  constructor(min: Vector3 = new Vector3(), max: Vector3 = new Vector3()) {
    this.min = min;
    this.max = max;
  }

  /**
   * Sets the boundaries of this box using the provided min and max points.
   * @param min - The new minimum point for the box
   * @param max - The new maximum point for the box
   * @returns Returns the current Box3 instance for method chaining
   */
  set(min: Vector3, max: Vector3): this {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  /**
   * Copies the boundaries of another box into this box.
   * @param box - The box to copy from
   * @returns Returns the current Box3 instance for method chaining
   */
  copy(box: Box3): this {
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }

  /**
   * Creates a new Box3 with the same boundaries as this box.
   * @returns A new Box3 instance with copied boundaries
   */
  clone(): Box3 {
    const box = new Box3();
    box.copy(this);
    return box;
  }

  /**
   * Determines if this box is equal to another box by comparing their min and max points.
   * @param box - The box to compare with
   * @returns True if the boxes are equal, false otherwise
   */
  equal(box: Box3): boolean {
    return this.min.equal(box.min) && this.max.equal(box.max);
  }

  /**
   * Expands the box by the given number in all directions.
   * @param num - The amount to expand the box by
   * @returns Returns the current Box3 instance for method chaining
   */
  expandByNumber(num: number): this {
    const vector = new Vector3(num, num, num);
    return this.expandByVector(vector);
  }

  /**
   * Expands the box by the given vector in all directions.
   * @param vector - The vector defining the expansion amounts along each axis
   * @returns Returns the current Box3 instance for method chaining
   */
  expandByVector(vector: Vector3): this {
    this.min.subtract(vector);
    this.max.add(vector);
    return this;
  }
}

export { Box3 };
