// 游戏全局类

import dF = require("./TypeDefine"); 

export namespace Global {

	// 游戏管理类
	export class GameRule{
		private constructor(){
			this.initOnFile();
			this.m_frame = 60;
		}

		private static m_Instance : GameRule = null!;

		public static getInstance(): GameRule{
			if(!this.m_Instance){
				this.m_Instance = new GameRule();
			}
			return this.m_Instance;
		}

		// 初始化读取存档
		public initOnFile():void{
			let playerData:string;
			// playerData read

			playerData = cc.sys.localStorage.getItem("data");
			if(playerData == null){
				this.createNewData();
				playerData = cc.sys.localStorage.getItem("data");
			}
			let data:ConfigManager = new ConfigManager(playerData);
			let table:ConfigTable = data.getTable("Character");
			this.m_playerLevel = table.getColumn("level").asNumber();
		}

		// 创建新存档
		public createNewData():void{
			cc.sys.localStorage.removeItem("data");
			let data:string;
			data = "[Character]\n";
			data += "level=1\n";
			cc.sys.localStorage.setItem("data",data);
		}

		// 玩家命中打击感回调
		public nodeSTCallBack(event:dF.CUSDefine.AttEvent){
			
		}

		// 随机值
		public random(lower:number, upper:number):number {
			return Math.random()*(upper-lower)+lower;
		}

		// 各种属性
		set setPlayerName(_name:string)
			{this.m_playerName = _name;}

		get getPlayerName():string
			{return this.m_playerName;}

		set setPlayerLevel(_level:number)
			{this.m_playerLevel = _level;}

		get getPlayerLevel():number
			{return this.m_playerLevel;}
		
		private m_playerName:string;	// 玩家名字
		private m_playerLevel:number;	// 玩家等级
		private m_frame:number;			// 游戏帧率
	};

	// 数据值
	export class ConfigColumn{
		constructor(str:string){
			this.m_regTest = new RegExp(/(^\s?[a-zA-Z_][a-zA-Z0-9_]*\s*)=(.+)/m);
			let value = this.m_regTest.exec(str);
			this.m_name = value[1];
			this.m_value = value[2];

			this.replaceSpace();
		}

		set setName(name:string)
			{this.m_name = name;}

		get getName():string
			{return this.m_name;}

		asString():string{
			return this.m_value;
		}

		asNumber():number{
			return Number(this.m_value);
		}

		asArrayStr(plist:string = ','):string[]{
			let result:string[];
			result = this.m_value.split(plist);
			return result;
		}

		asArrayNum(plist:string = ','):number[]{
			let result:number[];
			let temp:string[];
			temp = this.m_value.split(plist);
			temp.forEach((str:string)=>{
				let num:number = Number(str);
				if(num != NaN){
					result.push(num);
				}
			});
			return result;
		}

		private replaceSpace():void{
			this.m_name.replace(/(^\s*)|(\s*$)/g,"");
			this.m_value.replace(/(^\s*)|(\s*$)/g,"");
		}

		private m_regTest:RegExp;
		private m_name:string;
		private m_value:string;
	}

	// 数据表
	export class ConfigTable{
		constructor(file:string){
			file = file.replace('\r','\n');
			file = file.replace('\n\n','\n');

			let strArray:string[] = file.split('\n');
			strArray.forEach((str:string)=>{
				if(!this.m_regTest.test(str)){
					return;
				}

				let column:ConfigColumn = new ConfigColumn(str);
				this.m_tableList.set(column.getName,column);
			});
		}

		public getColumn(str:string):ConfigColumn{
			if(this.m_tableList.get(str) != null){
				return this.m_tableList.get(str);
			}

			return null;
		}

		set setTabName(name:string)
			{this.m_tabname = name;}

		get getTabName():string
			{return this.m_tabname;}
		

		private m_regTest:RegExp = new RegExp(/(^\s?[a-zA-Z_][a-zA-Z0-9_]*\s*)=(.+)/m);
		private m_tabname:string;
		private m_tableList:Map<string,ConfigColumn> = new Map();
	};

	interface tabStruct{
		name:string,
		length:number
	}

	// 数据文件
	export class ConfigManager{
		constructor(file:string){
			// read all file
			this.getTablesFromFile(file);
		}

		getTablesFromFile(file:string):void{
			this.m_file.clear();

			let spe:RegExp = new RegExp(/\;(.+?)/g);
			file = file.replace(spe, '\n');
			this.m_reg = new RegExp(/([\n|\r]|^)\[(.+?)\]/g);

			let offsetVec:tabStruct[] = Array<tabStruct>();

			for(;;){
				let result:string[];
				result = this.m_reg.exec(file);

				if(result != null){
					let tabStr:tabStruct={
						name:result[0]?.replace(/([\n|\r])/,""),
						length:this.m_reg.lastIndex
					};
					offsetVec.push(tabStr);
					continue;
				}
				break;
			}
			if(offsetVec.length != 0){
				offsetVec.push({
					name:"End",
					length:file.length
				});
			}else{
				return;
			}

			let brk:boolean = true;
			for(let i:number = 0 ;brk;i++){
				let tabText:string;
				brk = (offsetVec[i+1].name == "End");
				if(brk){
					tabText = file.substr(offsetVec[i].length);	
				}else{
					tabText = file.substr(offsetVec[i+1].length,offsetVec[i].length);
				}
				
				let tabClas:ConfigTable = new ConfigTable(tabText);
				tabClas.setTabName = offsetVec[i].name;

				this.m_file.set(offsetVec[i].name,tabClas);
				brk = !brk;
			}
		}

		getTable(tableName:string):ConfigTable {
			tableName = `[${tableName}]`;
			let tab : ConfigTable;
			tab = this.m_file.get(tableName);
			if(tab != undefined){
				return tab;
			}
			return undefined;
		}

		private m_reg:RegExp;
		private m_file:Map<string,ConfigTable> = new Map();
	};
};