// 人物碰撞检测类

const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class ColliBoxTarget extends cc.Component {
    private m_canColl:boolean = false;
    private body:Character;

	@property({displayName:"玩家组件名称"})
	ComName:string = "character";

    onLoad () {
		cc.director.getCollisionManager().enabled = true;
        this.body = this.node.parent.getChildByName("body").getComponent(this.ComName);
    }
    
    onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider):void{
		if(this.m_canColl == true){
			return;
		}

		this.m_canColl = true;
        this.body.onCollisionEnter(other,self);
	}

	onCollisionStay(other:cc.BoxCollider, self:cc.BoxCollider):void{
		this.body.onCollisionStay(other,self);
	}

	onCollisionExit(other:cc.BoxCollider, self:cc.BoxCollider):void{
		if(this.m_canColl == false){
			return;
		}

		this.m_canColl = false;
		this.body.onCollisionExit(other,self);
	}
}
