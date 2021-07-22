const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class ColliBoxTarget extends cc.Component {
    
    private body:Character;

    onLoad () {
		cc.director.getCollisionManager().enabled = true;
        this.body = this.node.parent.getChildByName("body").getComponent("character");
    }
    
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider):void{
        this.body.onCollisionEnter(other,self);
	}

	onCollisionStay(other:cc.BoxCollider, self:cc.BoxCollider):void{
		this.body.onCollisionStay(other,self);
	}

	onCollisionExit(other:cc.BoxCollider, self:cc.BoxCollider):void{
		this.body.onCollisionExit(other,self);
	}
}
