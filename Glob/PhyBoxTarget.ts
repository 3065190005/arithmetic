// 人物物理检测类

const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class PhyBoxTarget extends cc.Component {
    
    private body:Character;

    @property({displayName:"玩家组件名称"})
	ComName:string = "character";

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        this.body = this.node.getChildByName("body").getComponent(this.ComName);
    }


    onBeginContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        //只在两个碰撞体开始接触时调用一次
        this.body.onBeginContact(contact,selfCollider,otherConllider);
    }

	onPreSolve(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        //每次将要处理碰撞体接触逻辑时被调用
        this.body.onPreSolve(contact,selfCollider,otherConllider);
    }

	onPostSolve(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        //每次处理完碰撞体接触逻辑时被调用
        this.body.onPostSolve(contact,selfCollider,otherConllider);
    }

	onEndContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        this.body.onEndContact(contact,selfCollider,otherConllider);
    }
}
