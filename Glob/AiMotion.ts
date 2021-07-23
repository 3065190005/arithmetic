const {ccclass, property} = cc._decorator;

import Character from "./character";
import tD = require("./TypeDefine");
import gM = require("./GameManager");

@ccclass
export default class AiMotion extends cc.Component {

	ref:number = 0;

	@property({displayName:"bodyName"})
	bodyName:string = "character";

	@property({displayName:"viewValue"})
	viewVal:number = 0;

	private Target:Character;

	private body:Character;
	
	@property({type:cc.Enum(tD.CUSDefine.AiType),displayName:"type"})
	AiType:tD.CUSDefine.AiType;

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

	refAdder(dt:number):boolean{
		let ret = 0;
		switch(this.AiType){
			case tD.CUSDefine.AiType.Normal:
				ret = 20;
				break;
			case tD.CUSDefine.AiType.KeeyAway:
				ret = 3;
				break;
			case tD.CUSDefine.AiType.AlwaysAtt:
				ret = 6;
				break;
			case tD.CUSDefine.AiType.FastRound:
				ret = 2;
				break;
			deafult:
				return false;
		}

		if(this.ref >= ret){
			this.ref = 0;
			return true;
		}

		this.ref += dt;
		return false;
	}


	normal(dt:number):void{
		if(!this.refAdder(dt)){
			return;
		}

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