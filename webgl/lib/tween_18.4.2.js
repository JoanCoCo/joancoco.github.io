   Bud1                                                                      o n _ 0 6 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          @      �                                        @      �                                          @      �                                          @                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c a n n o n _ 0 6 2 . j sIlocblob      A   .������      C o o r d i n a t e s . j sIlocblob      �   .������      c u o n - m a t r i x . j sIlocblob        .������      c u o n - u t i l s . j sIlocblob     �   .������      d a t . g u i . m i n . j sIlocblob     �   .������      D e t e c t o r . j sIlocblob     g   .������      g l - m a t r i x - m i n . j sIlocblob      A   �������      G L T F L o a d e r . j sIlocblob      �   �������      j q u e r y - 1 . 8 . 3 . m i n . j sIlocblob        �������      O r b i t C o n t r o l s . j sIlocblob     �   �������     
 R E A D M E . t x tIlocblob     �   �������      s t a t s . m i n . j sIlocblob     g   �������      t h r e e . j sIlocblob      �  ������      t h r e e . m i n . j sIlocblob     �  ������      t h r e e . m i n _ r 9 6 . j sIlocblob       ������      t h r e e . m o d u l e . j sIlocblob     �  ������      t h r e e _ r 1 2 2 . j sIlocblob      A  ������      t h r e e x . k e y b o a r d s t a t e . j sIlocblob     �  ~������      t w e e n . m i n . j sIlocblob     g  ������      t w e e n _ 1 8 . 4 . 2 . j sIlocblob     %  �������      w e b g l - d e b u g . j sIlocblob      A  ~������      w e b g l - u t i l s . j sIlocblob      �  ~������                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                E                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         DSDB                                 `          �                                        @      �                                          @      �                                          @       e b g l - u t i l s . j sIlocblob      �  ~������                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    atcher.prototype, {
		addEventListener: function addEventListener(type, listener) {
			if (this._listeners === undefined) this._listeners = {};
			var listeners = this._listeners;

			if (listeners[type] === undefined) {
				listeners[type] = [];
			}

			if (listeners[type].indexOf(listener) === -1) {
				listeners[type].push(listener);
			}
		},
		hasEventListener: function hasEventListener(type, listener) {
			if (this._listeners === undefined) return false;
			var listeners = this._listeners;
			return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
		},
		removeEventListener: function removeEventListener(type, listener) {
			if (this._listeners === undefined) return;
			var listeners = this._listeners;
			var listenerArray = listeners[type];

			if (listenerArray !== undefined) {
				var index = listenerArray.indexOf(listener);

				if (index !== -1) {
					listenerArray.splice(index, 1);
				}
			}
		},
		dispatchEvent: function dispatchEvent(event) {
			if (this._listeners === undefined) return;
			var listeners = this._listeners;
			var listenerArray = listeners[event.type];

			if (listenerArray !== undefined) {
				event.target = this; // Make a copy, in case listeners are removed while iterating.

				var array = listenerArray.slice(0);

				for (var i = 0, l = array.length; i < l; i++) {
					array[i].call(this, event);
				}
			}
		}
	});

	var _lut = [];

	for (var i = 0; i < 256; i++) {
		_lut[i] = (i < 16 ? '0' : '') + i.toString(16);
	}

	var _seed = 1234567;
	var MathUtils = {
		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,
		generateUUID: function generateUUID() {
			// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
			var d0 = Math.random() * 0xffffffff | 0;
			var d1 = Math.random() * 0xffffffff | 0;
			var d2 = Math.random() * 0xffffffff | 0;
			var d3 = Math.random() * 0xffffffff | 0;
			var uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' + _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' + _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] + _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff]; // .toUpperCase() here flattens concatenated strings to save heap memory space.

			return uuid.toUpperCase();
		},
		clamp: function clamp(value, min, max) {
			return Math.max(min, Math.min(max, value));
		},
		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation
		euclideanModulo: function euclideanModulo(n, m) {
			return (n % m + m) % m;
		},
		// Linear mapping from range <a1, a2> to range <b1, b2>
		mapLinear: function mapLinear(x, a1, a2, b1, b2) {
			return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
		},
		// https://en.wikipedia.org/wiki/Linear_interpolation
		lerp: function lerp(x, y, t) {
			return (1 - t) * x + t * y;
		},
		// http://en.wikipedia.org/wiki/Smoothstep
		smoothstep: function smoothstep(x, min, max) {
			if (x <= min) return 0;
			if (x >= max) return 1;
			x = (x - min) / (max - min);
			return x * x * (3 - 2 * x);
		},
		smootherstep: function smootherstep(x, min, max) {
			if (x <= min) return 0;
			if (x >= max) return 1;
			x = (x - min) / (max - min);
			return x * x * x * (x * (x * 6 - 15) + 10);
		},
		// Random integer from <low, high> interval
		randInt: function randInt(low, high) {
			return low + Math.floor(Math.random() * (high - low + 1));
		},
		// Random float from <low, high> interval
		randFloat: function randFloat(low, high) {
			return low + Math.random() * (high - low);
		},
		// Random float from <-range/2, range/2> interval
		randFloatSpread: function randFloatSpread(range) {
			return range * (0.5 - Math.random());
		},
		// Deterministic pseudo-random float in the interval [ 0, 1 ]
		seededRandom: function seededRandom(s) {
			if (s !== undefined) _seed = s % 2147483647; // Park-Miller algorithm

			_seed = _seed * 16807 % 2147483647;
			return (_seed - 1) / 2147483646;
		},
		degToRad: function degToRad(degrees) {
			return degrees * MathUtils.DEG2RAD;
		},
		radToDeg: function radToDeg(radians) {
			return radians * MathUtils.RAD2DEG;
		},
		isPowerOfTwo: function isPowerOfTwo(value) {
			return (value & value - 1) === 0 && value !== 0;
		},
		ceilPowerOfTwo: function ceilPowerOfTwo(value) {
			return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
		},
		floorPowerOfTwo: function floorPowerOfTwo(value) {
			return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
		},
		setQuaternionFromProperEuler: function setQuaternionFromProperEuler(q, a, b, c, order) {
			// Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles
			// rotations are applied to the axes in the order specified by 'order'
			// rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
			// angles are in radians
			var cos = Math.cos;
			var sin = Math.sin;
			var c2 = cos(b / 2);
			var s2 = sin(b / 2);
			var c13 = cos((a + c) / 2);
			var s13 = sin((a + c) / 2);
			var c1_3 = cos((a - c) / 2);
			var s1_3 = sin((a - c) / 2);
			var c3_1 = cos((c - a) / 2);
			var s3_1 = sin((c - a) / 2);

			switch (order) {
				case 'XYX':
					q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
					break;

				case 'YZY':
					q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
					break;

				case 'ZXZ':
					q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
					break;

				case 'XZX':
					q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
					break;

				case 'YXY':
					q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
					break;

				case 'ZYZ':
					q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
					break;

				default:
					console.warn('THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: ' + order);
			}
		}
	};

	function _defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}

	function _createClass(Constructor, protoProps, staticProps) {
		if (protoProps) _defineProperties(Constructor.prototype, protoProps);
		if (staticProps) _defineProperties(Constructor, staticProps);
		return Constructor;
	}

	function _inheritsLoose(subClass, superClass) {
		subClass.prototype = Object.create(superClass.prototype);
		subClass.prototype.constructor = subClass;
		subClass.__proto__ = superClass;
	}

	function _assertThisInitialized(self) {
		if (self === void 0) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return self;
	}

	var Vector2 = /*#__PURE__*/function () {
		function Vector2(x, y) {
			if (x === void 0) {
				x = 0;
			}

			if (y === void 0) {
				y = 0;
			}

			Object.defineProperty(this, 'isVector2', {
				value: true
			});
			this.x = x;
			this.y = y;
		}

		var _proto = Vector2.prototype;

		_proto.set = function set(x, y) {
			this.x = x;
			this.y = y;
			return this;
		};

		_proto.setScalar = function setScalar(scalar) {
			this.x = scalar;
			this.y = scalar;
			return this;
		};

		_proto.setX = function setX(x) {
			this.x = x;
			return this;
		};

		_proto.setY = function setY(y) {
			this.y = y;
			return this;
		};

		_proto.setComponent = function setComponent(index, value) {
			switch (index) {
				case 0:
					this.x = value;
					break;

				case 1:
					this.y = value;
					break;

				default:
					throw new Error('index is out of range: ' + index);
			}

			return this;
		};

		_proto.getComponent = function getComponent(index) {
			switch (index) {
				case 0:
					return this.x;

				case 1:
					return this.y;

				default:
					throw new Error('index is out of range: ' + index);
			}
		};

		_proto.clone = function clone() {
			return new this.constructor(this.x, this.y);
		};

		_proto.copy = function copy(v) {
			this.x = v.x;
			this.y = v.y;
			return this;
		};

		_proto.add = function add(v, w) {
			if (w !== undefined) {
				console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
				return this.addVectors(v, w);
			}

			this.x += v.x;
			this.y += v.y;
			return this;
		};

		_proto.addScalar = function addScalar(s) {
			this.x += s;
			this.y += s;
			return this;
		};

		_proto.addVectors = function addVectors(a, b) {
			this.x = a.x + b.x;
			this.y = a.y + b.y;
			return this;
		};

		_proto.addScaledVector = function addScaledVector(v, s) {
			this.x += v.x * s;
			this.y += v.y * s;
			return this;
		};

		_proto.sub = function sub(v, w) {
			if (w !== undefined) {
				console.warn('THREE.Vector