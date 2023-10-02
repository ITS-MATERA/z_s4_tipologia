sap.ui.define(['jquery.sap.global',
    "sap/ui/model/json/JSONModel",
		'./../library',
		"sap/m/Input",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/resource/ResourceModel",
    'sap/ui/core/Fragment'
	],
	function(jQuery, JSONModel,library, Input, Filter, FilterOperator, SimpleForm, ResourceModel, Fragment) {
		"use strict";

    const MODEL_TIPO_ENTITY = "EntityModelTipo";
    var oInputZTipo = Input.extend("custZtipo.zTipoLibrary.controls.InputZtipo", {
			metadata: {
				library: "custZtipo.zTipoLibrary",
				properties: {
					placeholder: {
						type: "string",
						defaultValue: "Scegli Tipologia"
					},
          value: {
						type: "string",
						defaultValue: ""
					},
          bukrs: {
						type: "string",
						defaultValue: ""
					},
          key:{
            type: "string",
            defaultValue:""
          },
          showValueHelp:{
            type:"string",
            defaultValue:"true"
          }
				},
				aggregations: {},
				events: {},
				renderer: {
					writeInnerAttributes: function(oRm, oInput) {
						sap.m.InputRenderer.writeInnerAttributes.apply(this, arguments);
					}
				}
			},

      init: function() {
        var self=this;
				// this.bRendering = false;
				Input.prototype.init.call(this);  
        self.attachValueHelpRequest(self._libOnShowDialogTipo);  
        self.attachSubmit(self._libOnSubmitTipo);  
			},

      _libOnSubmitTipo:function(oEvent){
        var self =this;
        if(!self.getValue() || self.getValue() === null || self.getValue()===""){
          self.setValue(null);
          self.setKey(null);  
        }
      },

			renderer: function(oRm, oInput) {
				sap.m.InputRenderer.render(oRm, oInput);
			},

      onAfterRendering: function() {
        var self =this;
      },

      _libOnShowDialogTipo:function(oEvent){
        console.log(oEvent);
        var self =this;
        var oModelJson = new JSONModel({
          PanelFilterVisible:true,
          PanelContentVisible:false,
          Bukrs:self.getBukrs(),
          CodTitolo:null,
          CodTipologia:null,
          DescTipologia:null,
          CodSottotipologia1Liv:null,
          DescSottotipologia1Liv:null,
          TipoResults:[]
        });

        self._libGetViewId(self,function(callback) {
          if(!self._libTipoDialog){
            self._libTipoDialog = Fragment.load({
              id: callback.Id,
              name: "custZtipo.zTipoLibrary.fragment._libTipoDialog",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }  
          self._libTipoDialog.then(function(oDialog){
            oDialog.setModel(oModelJson, MODEL_TIPO_ENTITY);
            oDialog.open();
          });
        });
      },

      _libOnCloseTipoDialog:function(oEvent){
        var self = this;
        self._libTipoDialog.then(function(oDialog){
          oDialog.close();
          oDialog.destroy();
          self._libTipoDialog=null;
        });
      },

      _libOnSearchTipoDialog:function(oEvent){
        var self = this,
          filters = [],  
          entity = oEvent.getSource().getParent().getModel(MODEL_TIPO_ENTITY),
          model = oEvent.getSource().getParent().getModel(MODEL_TIPO_ENTITY).getData();

          self._globalModelHelperHelper = new sap.ui.model.odata.v2.ODataModel({
            // serviceUrl: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/"
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

          if(model.CodSottotipologia1Liv && model.CodSottotipologia1Liv !== "")
            filters.push(new Filter({path: "ZcodTipo",operator: FilterOperator.EQ,value1: model.CodSottotipologia1Liv}));
          
          if(model.DescSottotipologia1Liv && model.DescSottotipologia1Liv !== "")
            filters.push(new Filter({path: "Ztipo",operator: FilterOperator.EQ,value1: model.DescSottotipologia1Liv}));
          
          console.log(self._globalModelHelperHelper);
          var oDataModel = self._globalModelHelperHelper;

          self._globalModelHelperHelper.metadataLoaded().then(function() {
            oDataModel.read("/ZhfTipoSet" , {
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

      _libOnConfirmTipoDialog:function(oEvent){
        var self =this;
        self._libGetViewId(self,function(callback) {
          var oView = callback.oView;
          var table = oView.byId("_libTableTipo");
          var selectedItem = table.getSelectedItem();
          
          var key = selectedItem.data("ZcodTipo");
          var text = selectedItem.data("Ztipo");
          // console.log(key + " - " + text);//TODO:da canc

          self.setKey(key);  
          self.setValue(text + " - " + key);
          
          if(self._libTipoDialog){
            self._libTipoDialog.then(function(oDialog){
              oDialog.close();
              oDialog.destroy();
              self._libTipoDialog=null;
            });
          }
        });
      },

      _libOnBackTipoDialog:function(oEvent){
        var self = this,
          entity = oEvent.getSource().getParent().getModel(MODEL_TIPO_ENTITY);
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

    return oInputZTipo;
  });