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

    const MODEL_SOTTOTIPO_ENTITY = "EntityModelSottotipo";
    var oInputZSottotipo = Input.extend("custZtipo.zTipoLibrary.controls.InputZsottotipo", {
			metadata: {
				library: "custZtipo.zTipoLibrary",
				properties: {
					placeholder: {
						type: "string",
						defaultValue: "Scegli Sottotipologia"
					},
          value: {
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
        self.attachValueHelpRequest(self._libOnShowDialogSottotipo);  
        self.attachSubmit(self._libOnSubmitSottotipo);  
			},

      _libOnSubmitSottotipo:function(oEvent){
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

        self._libGetViewId(self,function(callback) {
          console.log(callback);
          if(!self._libSottotipoDialog){
            console.log("qui");
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
            oDialog.open();
          });
        });
      },

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

          if(model.ZcodTipo && model.ZcodTipo !== "")
            filters.push(new Filter({path: "ZcodTipo",operator: FilterOperator.EQ,value1: model.ZcodTipo}));  

          if(model.Ztipo && model.ZTipo !== "")
            filters.push(new Filter({path: "Ztipo",operator: FilterOperator.Contains,value1: model.Ztipo}));  

          if(model.ZcodSottotipo && model.ZcodSottotipo !== "")
            filters.push(new Filter({path: "ZcodSottotipo",operator: FilterOperator.EQ,value1: model.ZcodSottotipo}));  

          if(model.Zsottotipo && model.Zsottotipo !== "")
            filters.push(new Filter({path: "Zsottotipo",operator: FilterOperator.EQ,value1: model.Zsottotipo}));  
          
          var oDataModel = self._globalModelHelperHelper;

          self._globalModelHelperHelper.metadataLoaded().then(function() {
            oDataModel.read("/ZhfSottotipoSet" , {
                filters: filters,    
                success: function(data, oResponse){
                  console.log(data);
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
          var table = oView.byId("_libTableSottotipo");
          var selectedItem = table.getSelectedItem();
          
          var key = selectedItem.data("ZcodSottotipo");
          var text = selectedItem.data("Zsottotipo");
          self.setKey(key);  
          // self.setValue(text);
          self.setValue(selectedItem.data("Ztipo") + " " + selectedItem.data("Zsottotipo") + " - " + selectedItem.data("ZcodTipo") + " " +  selectedItem.data("ZcodSottotipo"));
          
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