// Ai类

const {ccclass, property} = cc._decorator;

import Character from "./character";
import tD = require("./TypeDefine");
import gM = require("./GameManager");

@ccclass
export default class AiMotion extends cc.Component {

	ref:number = 0;

	@property({displayName:"bodyName"})
	bodyName:string = "character";

	// 带攻击的敌人最大视野值
	@property({displayName:"EnemyMaxView"})
	viewVal:number = 0;

	private Target:Character;

	private body:Character;
	
	@property({ type:cc.Enum(tD.CUSDefine.AiType) })
	AiType:tD.CUSDefine.AiType = tD.CUSDefine.AiType.None;

	start():void{
		this.body = this.node.getComponent(this.bodyName);
	}

	update(dt:number):void{
		switch(this.AiType){
			case tD.CUSDefine.AiType.Normal:
				this.normal(dt);
				break;
			default:
				break;
		};
	}

	normal(dt:number):void{
		if(this.ref < 0.5){
			this.ref+=dt;
			return;
		}

		this.ref = 0;

		let GameRule:gM.Global.GameRule = gM.Global.GameRule.getInstance();
		this.body.m_Inputkey[cc.macro.KEY.a] = 0;
		this.body.m_Inputkey[cc.macro.KEY.d] = 0;

		if(GameRule.random(1,100) > 50){
			return;
		}else if(GameRule.random(1,100) > 50){
			this.body.m_Inputkey[cc.macro.KEY.d] = 1;
		}else{
			this.body.m_Inputkey[cc.macro.KEY.a] = 1;
		}
		return;
	}
}