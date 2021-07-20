export namespace Global {
	export class GameRule{
		private constructor(){
			this.initOnFile();
		}

		private static m_Instance : GameRule = null!;

		public static getInstance(): GameRule{
			if(!this.m_Instance){
				this.m_Instance = new GameRule();
			}
			return this.m_Instance;
		}

		public initOnFile():void{

		}

		set setPlayerName(_name:string)
			{this.m_playerName = _name;}

		get getPlayerName():string
			{return this.m_playerName;}

		set setPlayerLevel(_level:number)
			{this.m_playerLevel = _level;}

		get getPlayerLevel():number
			{return this.m_playerLevel;}
		
		private m_playerName:string;
		private m_playerLevel:number;
	};

	export class ConfigColumn{
		constructor(str:string){
			
		}

		set setName(name:string)
			{this.name = name;}

		get getName():string
			{return this.name;}

		private name:string;
		private value:any;
	}

	export class ConfigTable{
		constructor(file:string){
			file = file.replace('\r','\n');
			file = file.replace('\n\n','\n');

			let strArray = file.split('\n');
			strArray.forEach((str:string)=>{
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
		

		private m_tabname:string;
		private m_tableList:Map<string,ConfigColumn>;
	};

	interface tabStruct{
		name:string,
		length:number
	}

	export class ConfigManager{
		constructor(file:string){
			// read all file

			let spe:RegExp = new RegExp(/\/\/(.+?)/g);
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
				brk = (offsetVec[i++].name == "End");
				if(brk){
					tabText = file.substr(offsetVec[i].length);	
				}else{
					tabText = file.substr(offsetVec[i++].length,offsetVec[i].length);
				}
				
				let tabClas:ConfigTable = new ConfigTable(tabText);
				tabClas.setTabName =offsetVec[i].name;

				this.m_file.set(offsetVec[i].name,tabClas);
			}
		}

		readTable(tableName:string):ConfigTable {
			if(this.m_file.get(tableName) != null){
				return this.m_file.get(tableName);
			}
			return null;
		}

		private m_reg:RegExp;
		private m_file:Map<string,ConfigTable>;
	};
};