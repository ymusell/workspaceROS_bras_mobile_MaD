#include <iostream>
#include <fstream>
#include <jsoncpp/json/json.h> // or jsoncpp/json.h , or json/json.h etc.
#include <vector>
#include <string>

using namespace std;

class Position
{
public:
   Position(){
      m_name = "none";
      m_pos_x = 0.0;
      m_pos_y = 0.0;
      m_pos_z = 0.0;
      m_ori_x = 0.0;
      m_ori_y = 0.0;
      m_ori_z = 0.0;
      m_ori_w = 0.0;
   }
   void changeValue(const string& name,const float& pos_x,const float& pos_y,const float& pos_z,const float& ori_x,const float& ori_y,const float& ori_z,const float& ori_w){
      m_name = name;
      m_pos_x = pos_x;
      m_pos_y = pos_y;
      m_pos_z = pos_z;
      m_ori_x = ori_x;
      m_ori_y = ori_y;
      m_ori_z = ori_z;
      m_ori_w = ori_w;
   }
   void changeName(const string& name){
      m_name = name;
   }
   const void afficher(){
      cout<<"le nom de la pièce est : "<<m_name<<endl;
      cout<<"valeur de pos_x : "<<m_pos_x<<endl;
      cout<<"valeur de pos_y : "<<m_pos_y<<endl;
      cout<<"valeur de pos_z : "<<m_pos_z<<endl;
      cout<<"valeur de ori_x : "<<m_ori_x<<endl;
      cout<<"valeur de ori_y : "<<m_ori_y<<endl;
      cout<<"valeur de ori_z : "<<m_ori_z<<endl;
      cout<<"valeur de ori_w : "<<m_ori_w<<endl;
   }
private:
   string m_name;
   float m_pos_x;
   float m_pos_y;
   float m_pos_z;
   float m_ori_x;
   float m_ori_y;
   float m_ori_z;
   float m_ori_w;
};

int main() {
   ifstream ifs("essai.json");
   Json::Reader reader;
   Json::Value obj;
   reader.parse(ifs, obj); // reader can also read strings
   vector<Position> chaire_stage(0);
   const Json::Value& val = obj["positions"];
   Position point;
   for (int k=0;k<val.size();k++){
      point.changeValue(val[k]["nom"].asString(),val[k]["position_x"].asFloat(),
         val[k]["position_y"].asFloat(),val[k]["position_z"].asFloat(),
         val[k]["orientation_x"].asFloat(),val[k]["orientation_y"].asFloat(),
         val[k]["orientation_z"].asFloat(),val[k]["orientation_w"].asFloat());
      chaire_stage.push_back(point);
   }
   /*Affichage du vecteur créé*/
   for(vector<Position>::iterator it=chaire_stage.begin(); it!=chaire_stage.end(); ++it)
   {
      cout<<"nouvelle pièce"<<endl;
      it->afficher();
   }
   /*cout<<val[4]["orientation_w"]<<endl;
   cout<<atof(val[4]["orientation_w"].asString().c_str())<<endl;
   printf("%.12f",val[4]["orientation_w"].asFloat());*/
}