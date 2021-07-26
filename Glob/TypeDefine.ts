// 类型定义类

export namespace CUSDefine {
	export enum State{
		None,
		Idle,
		Move,
		Attack,
		Hurt,
		Dead,
	};

	export enum AiType{
		None,
		Normal,
		KeeyAway,
		AlwaysAtt,
		FastRound,
	}

	export interface AttEvent{
		attNode:any,		// 攻击者(node)
		hitNode:any,		// 受害者(node)
		damage:number,		// 攻击值(number)
		hitback:any,		// 击退值(vec2)
		hitLev:number		// 打击感等级(影响顿帧和抖屏)
	};

	export enum CharacterType{
		None,
		Player,
		Boss,
		Enemy,
		Teammate
	};

	export let StatusVec:Map<string,State> = new Map([
		["None",State.None],
		["Idle",State.Idle],
		["Move",State.Move],
		["Attack",State.Attack],
		["Hurt",State.Hurt],
		["Dead",State.Dead]
	]);
};