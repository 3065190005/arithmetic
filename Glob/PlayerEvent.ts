const {ccclass, property} = cc._decorator;

import Character from "./character";

@ccclass
export default class PlayerEvent extends cc.Component {

	targetBool:boolean = true;

	@property({displayName:"bodyName"});
	bodyName:string="character";

	private body:Character;

	start() : void{
		this.body = this.node.getComponent(this.bodyName);

		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
	}

	onDestroy():void{
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
	}

	update(dt:number):{

	}

	onKeyDown(event:cc.Event.EventKeyboard):void{
		if(!this.targetBool){
			return;
		}

		this.body.m_Inputkey[event.keyCode] = 1;
		this.SkillTree(event.keyCode);
	}

	onKeyUp(event:cc.Event.EventKeyboard):void{
		if(!this.targetBool){
			return;
		}

		this.body.m_Inputkey[event.keyCode] = 0;
		this.SkillTree(event.keyCode);
	}

	SkillTree(key:cc.macro.KEY):void{
		
	}

}