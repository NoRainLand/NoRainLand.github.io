(function () {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
        canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });
        document.onresize = () => {
            canvas.height = (canvas.height / 16) * 9;
        };

        let gl = canvas.getContext("webgl")!;

        //-------------loader----------------
        let loader = {
            textureId: 0,
            isPowerOf2: (value) => {
                return (value & (value - 1)) == 0;
            },
            updateTexture: (gl, image) => {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                if (loader.isPowerOf2(image.width) && loader.isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
            },
            loadTexture: (url) => {
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    img.onload = () => {
                        let texture = gl.createTexture();
                        gl.activeTexture(gl.TEXTURE0 + loader.textureId++);
                        gl.bindTexture(gl.TEXTURE_2D, texture);
                        loader.updateTexture(gl, img);
                        resolve(texture);
                    };
                    img.onerror = () => {
                        reject("load texture error");
                    }
                    img.src = url;
                });
            },

            loadShader: async (url): Promise<string> => {
                const response = await fetch(url);
                return await response.text();
            },
        };
        //-------------shader----------------
        let shader = {
            createShader: (gl, type, source) => {
                const shader = gl.createShader(type); //创建着色器，
                gl.shaderSource(shader, source); //提供数据源
                gl.compileShader(shader); //编译着色器
                return shader;
            },
            createProgram: (gl, vertexShader, fragmentShader) => {
                const program = gl.createProgram(); //创建着色器程序
                gl.attachShader(program, vertexShader); //将着色器添加到着色器程序
                gl.attachShader(program, fragmentShader); //将着色器添加到着色器程序
                gl.linkProgram(program); //链接着色器程序
                return program;
            }
        };
        //-------------main----------------
        let program;

        let loadTexture = async () => {
            await loader.loadTexture("../img/lazymoon.jpg");
            await loader.loadTexture("../img/lazymoon_depth.jpg");
        };
        let loadShader = async () => {
            let vsSource = await loader.loadShader("../shader/depth.vs.glsl");
            let fsSource = await loader.loadShader("../shader/depth.fs.glsl");
            let vertexShader = shader.createShader(gl, gl.VERTEX_SHADER, vsSource);
            let fragmentShader = shader.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
            program = shader.createProgram(gl, vertexShader, fragmentShader);
        };

        let dimensions = [1920, 1080, 1920, 1080];//硬编码
        let scale = 0.0115;
        let offset = [0.1, 0.1, 0.1];
        let focus = 0.01;
        let shakeType = 1;
        let rotY = 333 / 1920;
        let animateScale = {
            x: 0.95,
            y: 0.95,
            z: 0.95,
            px: 0.9,
            py: 0.925,
            pz: 0.925,
        };
        let animateDuration = 8;

        let u_texutre;
        let u_texture_depth;
        let u_dimensions;
        let u_scale;
        let u_offset;
        let u_focus;
        let u_clipMatDir;
        let u_clipMatPos;
        let u_size;
        let a_posuv;
        let buffer;

        // uniform sampler2D texture;
        // uniform sampler2D texture_depth;
        // uniform vec4 dimensions;
        // uniform float scale;
        // uniform vec3 offset;
        // uniform float focus;

        // attribute vec4 posuv;

        // uniform vec4 clipMatDir;
        // uniform vec2 clipMatPos;
        // uniform vec2 size;

        let size = [canvas.width, canvas.height];
        let clipMatDir = [99999999, 0, 0, 99999999];
        let clipMatPos = [0, 0];

        let changeOffset = (time) => {
            let s = animateScale.px;
            let l = animateScale.py;
            let u = animateScale.pz;
            switch (shakeType) {
                default:
                case 0:
                    offset = [Math.sin(2 * Math.PI * (time + s)) * animateScale.x, 0.1, 0.1];
                    break;
                case 1:
                    offset = [0.1, Math.sin(2 * Math.PI * (time + l)) * animateScale.y, 0.1];
                    break;
                case 2:
                    offset = [0.1, 0.1, 0.5 * (1 + Math.sin(2 * Math.PI * (time + u))) * animateScale.z];
                    break;
                case 3:
                    offset = [Math.sin(2 * Math.PI * (time + s)) * animateScale.x, Math.sin(2 * Math.PI * (time + l)) * animateScale.y, 0.5 * (1 + Math.sin(2 * Math.PI * (time + u))) * animateScale.z];
                    break;
            }
        };

        let bufferData = [
            0, 0, 0, 0,
            0, canvas.height, 0, 1,
            canvas.width, canvas.height, 1, 1,
            canvas.width, canvas.height, 1, 1,
            0, 0, 0, 0,
            canvas.width, 0, 1, 0
        ];


        let initRender = () => {
            gl.useProgram(program);
            u_texutre = gl.getUniformLocation(program, "texture");
            u_texture_depth = gl.getUniformLocation(program, "texture_depth");
            u_dimensions = gl.getUniformLocation(program, "dimensions");
            u_scale = gl.getUniformLocation(program, "scale");
            u_offset = gl.getUniformLocation(program, "offset");
            u_focus = gl.getUniformLocation(program, "focus");
            u_clipMatDir = gl.getUniformLocation(program, "clipMatDir");
            u_clipMatPos = gl.getUniformLocation(program, "clipMatPos");
            u_size = gl.getUniformLocation(program, "size");
            a_posuv = gl.getAttribLocation(program, "posuv");
            buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
        };

        let isPlaying = false;
        let lastTime = 0;
        let runTime = 0;
        let _update = () => {
            let now = Date.now();
            let dt = now - lastTime;
            lastTime = now;
            update(dt);
            requestAnimationFrame(_update);
        };
        let update = (dt) => {
            if (isPlaying) {
                runTime += dt;
                changeOffset(Date.now() / 1e3 / animateDuration);
                render();
            }
        };
        let render = () => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.useProgram(program);

            gl.enableVertexAttribArray(a_posuv);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(a_posuv, 4, gl.FLOAT, false, 0, 0);

            gl.uniform1i(u_texutre, 0);
            gl.uniform1i(u_texture_depth, 1);
            gl.uniform4fv(u_dimensions, dimensions);
            gl.uniform1f(u_scale, scale);
            gl.uniform3fv(u_offset, offset);
            gl.uniform1f(u_focus, focus);
            gl.uniform2fv(u_size, size);

            gl.uniform4fv(u_clipMatDir, clipMatDir);
            gl.uniform2fv(u_clipMatPos, clipMatPos);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        let main = async () => {
            await loadShader();
            await loadTexture();
            await initRender();
            await _update();
            lastTime = Date.now();
            isPlaying = true;
        };

        main();
    }
})();
