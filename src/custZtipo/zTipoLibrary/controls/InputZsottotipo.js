sap.ui.define(['jquery.sap.global',
    "sap/ui/model/json/JSONModel",
		'./../library',
		"sap/m/Input",
    "sap/m/MultiInput",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/resource/ResourceModel",
    'sap/ui/core/Fragment'
	],
	function(jQuery, JSONModel,library, Input,MultiInput, Filter, FilterOperator, SimpleForm, ResourceModel, Fragment) {
		"use strict";

    const MODEL_SOTTOTIPO_ENTITY = "EntityModelSottotipo";
    var oInputZSottotipo = MultiInput.extend("custZtipo.zTipoLibrary.controls.InputZsottotipo", {
			metadata: {
				library: "custZtipo.zTipoLibrary",
				properties: {
					placeholder: {
						type: "string",
						defaultValue: "Scegli Sottotipologia"
					},
          // value: {
					// 	type: "string",
					// 	defaultValue: ""
					// },
          keydesc: {
						type: "string",
						defaultValue: ""
					},
          bukrs: {
						type: "string",
						defaultValue: ""
					},
          /*fanno riferimento alla tipologia di primo livello - start */
          zcodTipo:{
            type: "string",
						defaultValue: ""
          },
          ztipo:{
            type: "string",
						defaultValue: ""
          },
          /*fanno riferimento alla tipologia di primo livello - end */
          key:{
            type: "string",
            defaultValue:""
          },
          showValueHelp:{
            type:"string",
            defaultValue:"true"
          },
          valueHelpOnly:{
            type:"string",
            defaultValue:"true"
          }
				},
				aggregations: {},
				events: {},
				renderer: {
					writeInnerAttributes: function(oRm, oInput) {
						sap.m.MultiInputRenderer.writeInnerAttributes.apply(this, arguments);
					}
				}
			},

      init: function() {
        var self=this;
				// this.bRendering = false;
				MultiInput.prototype.init.call(this);  
        self.attachValueHelpRequest(self._libOnShowDialogSottotipo);  
        self.attachSubmit(self._libOnSubmitSottotipo);  
			},

      _libOnSubmitSottotipo:function(oEvent){
        var self =this, 
          multiInput = sap.ui.getCore().byId(self.getId());
        if(!self.getValue() || self.getValue() === null || self.getValue()===""){
          multiInput.setTokens([]);
          self.setValue(null);
          self.setKey(null);  
        }
      },

			renderer: function(oRm, oInput) {
				sap.m.MultiInputRenderer.render(oRm, oInput);
			},

      onAfterRendering: function() {
        var self =this;        
      },

      _libOnShowDialogSottotipo:function(oEvent){
        var self =this;
        var oModelJson = new JSONModel({
          PanelFilterVisible:true,
          PanelContentVisible:false,
          Bukrs:self.getBukrs(),
          CodTitolo:null,
          CodTipologia: null,
          DescTipologia: null,
          ZcodTipo: self.getZcodTipo() ? self.getZcodTipo() : null,
          Ztipo: self.getZtipo() ? self._libFormatCodTipologia(self.getZtipo()) : null,
          ZcodSottotipo:null,
          Zsottotipo:null,
          TipoResults:[]
        });

        var fnValidator = function(args){
          // console.log(args);
          var text = args.text;
          return new sap.m.Token({text:text, key:text});
        };

        self._libGetViewId(self,function(callback) {
          if(!self._libSottotipoDialog){
            self._libSottotipoDialog = Fragment.load({
              id: callback.Id,
              name: "custZtipo.zTipoLibrary.fragment._libSTDialog",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }   
          self._libSottotipoDialog.then(function(oDialog){
            oDialog.setModel(oModelJson, MODEL_SOTTOTIPO_ENTITY);

            var contentArray=oDialog.getContent()[0].getContent()[0].getContent();
            var _libZcodTipo = contentArray.filter(x=>x.sId.includes("_libZcodTipo")),
              _libZTipo = contentArray.filter(x=>x.sId.includes("_libZTipo")),
              tokens=[];
            if(_libZcodTipo){
              tokens=[];              
              _libZcodTipo=_libZcodTipo[0];
              if(self.getZcodTipo() && self.getZcodTipo() !== ""){
                var arrs = self.getZcodTipo().split(",");
                for(var i=0; i<arrs.length;i++){
                  var item = arrs[i];
                  tokens.push(new sap.m.Token({text:item, key:item}));
                }
              }
              _libZcodTipo.setTokens(tokens);
              _libZcodTipo.addValidator(fnValidator);
            }
            if(_libZTipo){
              tokens=[];
              _libZTipo=_libZTipo[0];
              if(self.getZtipo() && self.getZtipo() !== ""){
                var arrs = self.getZtipo().split(",");
                for(var i=0; i<arrs.length;i++){
                  var item = arrs[i];
                  tokens.push(new sap.m.Token({text:item, key:item}));
                }
              }
              _libZTipo.setTokens(tokens);

              // var fnValidator = function(args){
              //   // console.log(args);
              //   var text = args.text;
              //   return new sap.m.Token({text:text, key:text});
              // };

              _libZcodTipo.addValidator(fnValidator);
            }

            oDialog.open();
          });
        });
      },

      // onktm:function(oEvent){
      //   console.log(oEvent);
      // },

      // fnValidator:function(args){
      //   console.log(args);
			// 	var text = args.text;
			// 	return new Token({key: text, text: text});
			// },


      // _libZcodTipoSubmit:function(oEvent){
      //   var self =this;
      //   console.log(oEvent);
      // },

      _libFormatCodTipologia:function(tipoDesc){
        var text="";
        var arraySplit = tipoDesc.split(" - ");
        text = arraySplit[0];
        return text;
      },

      _libOnCloseSottotipoDialog:function(oEvent){
        var self = this;
        self._libSottotipoDialog.then(function(oDialog){
          oDialog.close();
          oDialog.destroy();
          self._libSottotipoDialog=null;
        });
      },

      _libOnSearchSottotipoDialog:function(oEvent){
        var self = this,
          filters = [],  
          entity = oEvent.getSource().getParent().getModel(MODEL_SOTTOTIPO_ENTITY),
          model = oEvent.getSource().getParent().getModel(MODEL_SOTTOTIPO_ENTITY).getData();

          self._globalModelHelperHelper = new sap.ui.model.odata.v2.ODataModel({
            serviceUrl: "/sap/opu/odata/sap/ZSS4_MATCHCODE_SRV/"
          });

          if(model.Bukrs && model.Bukrs !== "")
            filters.push(new Filter({path: "Bukrs",operator: FilterOperator.EQ,value1: model.Bukrs}));

          if(model.CodTitolo && model.CodTitolo !== "")
            filters.push(new Filter({path: "ZcodTitolo",operator: FilterOperator.EQ,value1: model.CodTitolo}));  
          
          if(model.CodTipologia && model.CodTipologia !== "")
            filters.push(new Filter({path: "ZcodTipologia",operator: FilterOperator.EQ,value1: model.CodTipologia}));  

          if(model.DescTipologia && model.DescTipologia !== "")
            filters.push(new Filter({path: "Ztipologia",operator: FilterOperator.Contains,value1: model.DescTipologia}));  

          // console.log(oEvent.getSource().getParent()) ; 
          var contentArray = oEvent.getSource().getParent().getContent()[0].getContent()[0].getContent(); 
          var _libZcodTipo = contentArray.filter(x=>x.sId.includes("_libZcodTipo"));
          if(_libZcodTipo){
            _libZcodTipo = _libZcodTipo[0];
            // console.log(_libZcodTipo.getTokens());
            for(var i=0; i<_libZcodTipo.getTokens().length;i++){
              var item = _libZcodTipo.getTokens()[i];
              filters.push(new Filter({path: "ZcodTipo",operator: FilterOperator.EQ,value1: item.getKey()}));  
            }
          }
          // if(model.ZcodTipo && model.ZcodTipo !== "")
          //   filters.push(new Filter({path: "ZcodTipo",operator: FilterOperator.EQ,value1: model.ZcodTipo}));  
          
          var _libZTipo = contentArray.filter(x=>x.sId.includes("_libZTipo"));
          if(_libZTipo){
            _libZTipo = _libZTipo[0];
            // console.log(_libZTipo.getTokens());
            for(var i=0; i<_libZTipo.getTokens().length;i++){
              var item = _libZTipo.getTokens()[i];
              filters.push(new Filter({path: "Ztipo",operator: FilterOperator.EQ,value1: item.getKey()}));  
            }
          }

          // if(model.Ztipo && model.ZTipo !== "")
          //   filters.push(new Filter({path: "Ztipo",operator: FilterOperator.Contains,value1: model.Ztipo}));  

          if(model.ZcodSottotipo && model.ZcodSottotipo !== "")
            filters.push(new Filter({path: "ZcodSottotipo",operator: FilterOperator.EQ,value1: model.ZcodSottotipo}));  

          if(model.Zsottotipo && model.Zsottotipo !== "")
            filters.push(new Filter({path: "Zsottotipo",operator: FilterOperator.EQ,value1: model.Zsottotipo}));  
          
          var oDataModel = self._globalModelHelperHelper;

          self._globalModelHelperHelper.metadataLoaded().then(function() {
            oDataModel.read("/ZhfSottotipoSet" , {
                filters: filters,    
                success: function(data, oResponse){
                  // console.log(data);
                  entity.setProperty("/TipoResults",data.results);
                  entity.setProperty("/PanelFilterVisible",false);
                  entity.setProperty("/PanelContentVisible",true);
              },
              error: function(error){
                console.log(error);
              }
            });
          });
      },

      _libOnConfirmSottotipoDialog:function(oEvent){
        var self =this;
        self._libGetViewId(self,function(callback) {
          var oView = callback.oView;
          var multiInput = sap.ui.getCore().byId(self.getId());   
          var table = oView.byId("_libTableSottotipo");
          var selectedItems = table.getSelectedItems();
          
          var tokens = [],
            keys=[],
            values=[];
          if(selectedItems.length>0){
            for(var i=0; i<selectedItems.length;i++){
              var selectedItem= selectedItems[i];
              var text = selectedItem.data("Ztipo") + " " + selectedItem.data("Zsottotipo") + " - " + selectedItem.data("ZcodTipo") + " " +  selectedItem.data("ZcodSottotipo");
              tokens.push(new sap.m.Token({text:text, key:selectedItem.data("ZcodSottotipo")}));
              keys.push(selectedItem.data("ZcodSottotipo"));
              values.push(selectedItem.data("Zsottotipo"));
            }
          }
          multiInput.setTokens(tokens);
          self.setKey(keys);  
          self.setKeydesc(values);    
          // if(selectedItem){
          //   var key = selectedItem.data("ZcodSottotipo");
          //   var text = selectedItem.data("Zsottotipo");
          //   self.setKey(key);  
          //   self.setValue(selectedItem.data("Ztipo") + " " + selectedItem.data("Zsottotipo") + " - " + selectedItem.data("ZcodTipo") + " " +  selectedItem.data("ZcodSottotipo"));
          // }
          // else{
          //   self.setKey(null); 
          //   self.setValue(null);
          // }

          if(self._libSottotipoDialog){
            self._libSottotipoDialog.then(function(oDialog){
              oDialog.close();
              oDialog.destroy();
              self._libSottotipoDialog=null;
            });
          }
        });
      },

      _libOnBackSottotipoDialog:function(oEvent){
        var self = this,
          entity = oEvent.getSource().getParent().getModel(MODEL_SOTTOTIPO_ENTITY);
        entity.setProperty("/TipoResults",[]);
        entity.setProperty("/PanelFilterVisible",true);
        entity.setProperty("/PanelContentVisible",false);
      },

      _libGetViewId:function(context,callback){
        var self =this;
        while (context && context.getParent) {
          var oParentControl = context.getParent();
          if (oParentControl instanceof sap.ui.core.mvc.View) {
            var viewId = oParentControl.getId();
            var oView = sap.ui.getCore().byId(viewId);
            // console.log(oView);//TODO:da canc
            callback({Id : viewId, oView: oView});
            break;
          }
          context = oParentControl;
        }
      }
    });   

    return oInputZSottotipo;
  });