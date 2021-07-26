// 世界类

const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class GameWorld extends cc.Component {

    private ref:number = 0;

    @property({displayName:"调试-碰撞体显示",type:cc.Boolean})
    m_Collidebug:boolean = false;

    @property({displayName:"调试-物理盒显示",type:cc.Boolean})
    m_Phydebug:boolean = false;

    start ():void {
        if(this.m_Collidebug == true){
            cc.director.getCollisionManager().enabledDebugDraw = true;
        }

        if(this.m_Phydebug == true){
            cc.director.getPhysicsManager().debugDrawFlags = 1;
        }
    }

    update (dt:number) :void{
        this.ref += dt;

        let rigid:cc.RigidBody = this.node.getChildByName("test1").getChildByName("test").getComponent(cc.RigidBody);
        let sped:cc.Vec2 = rigid.linearVelocity;
        sped.x = 15;
        if(sped.y == 0){
			sped.y = 150;
            rigid.linearVelocity = sped;
            this.node.getChildByName("test1").scaleX = this.node.getChildByName("test").scaleX * -1;
        }
    }

    @property([cc.Node])
    EnemyVec:Array<cc.Node> = [];

    Player:Character = null;
}
