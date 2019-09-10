import * as util from './utility';
import * as vec from './vector';

function getDist(ai, target) {
    return Math.abs(vec.magnitude({
        x: ai.ship.x - target.x,
        y: ai.ship.y - target.y,
    }));
}

function getAngle(ai, target, inverse) {
    let angle = util.degToRad(ai.ship.rotation) - vec.dir({
        x: ai.ship.x - target.x,
        y: ai.ship.y - target.y
    }) + Math.PI;

    angle = (angle % (Math.PI * 2)) - Math.PI;

    // Eh I got that backwards? So flip it around
    if (inverse) {
        if (angle > 0) {
            angle -= Math.PI;
        } else {
            angle += Math.PI;
        }
    }

    return angle;
}

export function update(ai) {
    //var otherPlayers = ai.game.players.filter(p => p !== ai);

    // Currently the AI will only fight player 1 and look for pickup 1
    var player = game.players[0];
    //var pickup = game.pickups[0];
    var pickup = null;

    if (!ai.ship || !ai.ship.isAlive || ai.game.over) {
        return;
    }

    var avoidingMeteor = false;

    game.meteors.forEach(meteor => {
        if (getDist(ai, meteor) > meteor.radius + 40) {
            return;
        }

        avoidingMeteor = true;

        var angleToMeteor = getAngle(ai, meteor)

        if (angleToMeteor < -1) {
            ai.ship.turnRight();
            ai.ship.engineOff();
        } else if (angleToMeteor > 1) {
            ai.ship.turnLeft();
            ai.ship.engineOff();
        } else {
            ai.ship.engineOn();
        }
    });

    if (avoidingMeteor) {
        return;
    }

    if (player.ship && player.ship.isAlive) {
        if (player.ship && player.ship.isAlive) {
            ai.distToPlayer = getDist(ai, player.ship);
        } else {
            ai.distToPlayer = null;
        }
    }

    if (pickup) {
        ai.distToPickup = getDist(ai, pickup);
    } else {
        ai.distToPickup = null;
    }

    if (ai.distToPlayer !== null && ai.distToPickup !== null) {
        ai.target = ai.distToPlayer < ai.distToPickup ? player.ship : pickup;
    } else if (player.ship && player.ship.isAlive) {
        ai.target = player.ship;
    } else if (pickup) {
        ai.target = pickup;
    } else {
        ai.target = null;
    }

    if (!ai.target) {
        return;
    }

    ai.angleToTarget = getAngle(ai, ai.target, true);

    if (ai.angleToTarget < -.1) {
        ai.ship.turnRight();
    } else if (ai.angleToTarget > .1) {
        ai.ship.turnLeft();
    } else {
        if (ai.distToPlayer < 100) {
            if (Math.random() < .1) { ai.ship.fire(); }
            if (Math.random() < .01) { ai.ship.engineOff(); }
            if (Math.random() < .01) { ai.ship.engineOn(); }
        } else {
            ai.ship.engineOn();
        }
    }


    // if (Math.abs(ai.angleToTarget % (Math.PI * 2) - Math.PI ) < .01) {
    //     ai.ship.fire();
    // }

    // var playerDistances = otherPlayers.map((player) => {
    //     if (!player.ship.isAlive) {
    //         return null;
    //     }
    //     return Math.abs(vec.dotProduct(
    //         { x: ai.ship.x, y: ai.ship.y },
    //         { x: player.ship.x, y: player.ship.y }
    //     ));
    // });
    //
    // console.log(playerDistances);
}
