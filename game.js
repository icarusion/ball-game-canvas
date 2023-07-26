window.onload = function() {
    var canvas = document.getElementById('gameCanvas'),
        $score = document.getElementById('scoreNum'),
        $highScore = document.getElementById('highScoreNum'),
        cxt = canvas.getContext('2d'),
        ballRadius = 10,
        centerBall = new Ball(ballRadius, '#f0ad4e'),
        balls = [],
        spring = 0.03,
        bounce = -1,
        isMouseDown = false,
        mouse = util.captureMouse(canvas),
        anmiRequest;

    centerBall.x = canvas.width / 2;
    centerBall.y = canvas.height - ballRadius;

    canvas.addEventListener('mousedown', function() {
        if (util.containsPoint(centerBall.getBounds(), mouse.x, mouse.y)) {
            isMouseDown = true;
            canvas.addEventListener('mouseup', onMouseUp, false);
            canvas.addEventListener('mousemove', onMouseMove, false);
        }
    }, false);

    function onMouseUp() {
        isMouseDown = false;
        canvas.removeEventListener('mouseup', onMouseUp, false);
        canvas.removeEventListener('mousemove', onMouseMove, false);
    }

    function onMouseMove() {
        centerBall.x = mouse.x;
        centerBall.y = mouse.y;
    }

    // 创建安全小球
    function createSafeBall(num) {
        for (var ball, i = 0; i < num; i++) {
            ball = new Ball(ballRadius, '#5cb85c');
            ball.x = Math.random() * canvas.width;
            ball.y = 0;
            ball.vx = Math.random() * 6 - 3;
            ball.vy = Math.random() * 6 - 3;
            ball.ballType = 'safe';
            balls.push(ball);
        }
    }

    // 创建红球D
    function createangerBall(num) {
        for (var ball, i = 0; i < num; i++) {
            ball = new Ball(ballRadius, '#ff0000');
            ball.x = Math.random() * canvas.width;
            ball.y = 0;
            ball.vx = Math.random() * 6 - 3;
            ball.vy = Math.random() * 6 - 3;
            ball.ballType = 'danger';
            balls.push(ball);
        }
    }

    // 球移动
    function move(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx *= bounce;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= bounce;
        }

        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy *= bounce;
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= bounce;
        }
    }

    // 绘制球
    function draw(ball) {
        var dx = ball.x - centerBall.x,
            dy = ball.y - centerBall.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            min_dist = ball.radius + centerBall.radius;

        // 撞击了
        if (dist < min_dist) {
            var score = parseInt($score.textContent);
            if (ball.ballType === 'safe') {
                $score.textContent = score + 1;
                balls.splice(balls.indexOf(ball), 1);
            } else if (ball.ballType === 'danger') {
                clearInterval(safeInterval);
                clearInterval(dangerInterval);
                window.cancelAnimationFrame(anmiRequest);
                // 保存最高分
                var highScore = parseInt(localStorage.getItem('highScore'));
                if (score > highScore) {
                    localStorage.setItem('highScore', score);
                    $highScore.textContent = localStorage.getItem('highScore');
                }
            }
        }

        ball.draw(cxt);
    }


    var safeInterval = setInterval(function() {
        createSafeBall(8);
    }, 3000);

    var dangerInterval = setInterval(function() {
        createangerBall(5);
    }, 8000);

    // 设置最高得分
    if (!localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', 0);
    }

    $highScore.textContent = localStorage.getItem('highScore');

    (function drawFrame() {
        anmiRequest = window.requestAnimationFrame(drawFrame, canvas);
        cxt.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach(move);
        balls.forEach(draw);

        centerBall.draw(cxt);
    }());
};