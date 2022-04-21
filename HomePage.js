import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-neat-date-picker';
import axios from 'axios';

const COLORS = [
  '#DDF00E',
  '#6CF00E',
  '#0EF021',
  '#0EF092',
  '#0EDDF0',
  '#0E6CF0',
];

const formatDate = timestamp => {
  var date = new Date(timestamp * 1000);
  return (
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes()
  );
};

const formatD = date => {
  var date = new Date(date);
  return (
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear()
  );
};

const HomePage = () => {
  const [reportData, setReportData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);

  const [incidentObject, setIncidentObject] = useState([]);
  const [reportStatus, setReportStatus] = useState([]);
  const [reportType, setReportType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [department, setDepartment] = useState([]);

  const renderItem = ({item}) => <Item item={item} />;

  const Item = ({item}) => (
    <View style={[styles.item, {flexDirection: 'row'}]}>
      <View style={{flex: 5}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#000000', fontWeight: '700', fontSize: 20}}>
            {item.reportNo}
          </Text>
          <Text
            style={{marginLeft: 5, color: COLORS[item.status], fontSize: 15}}>
            {reportStatus[item.status].name}
          </Text>
        </View>
        <View>
          <Text style={{fontStyle: 'italic'}}>
            {formatDate(item.createTime)}
          </Text>
          <Text>
            {reportType[item.reportType].name} |{' '}
            {incidentObject[item.incidentObject].name}
          </Text>
          <Text>{item.reporterName}</Text>
          <Text>{item.shortDescription}</Text>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="ellipsis-v" size={30} color="#108ea0"></Icon>
      </View>
    </View>
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const getReportData = async () => {
      const authData = await AsyncStorage.getItem('@authStorage');
      const userToken = `Bearer ` + JSON.parse(authData).data.access_token;
      const dataSend = {
        page: 1,
      };
      const {data} = await axios.post(
        `https://qlsc.maysoft.io/server/api/getAllReports`,
        dataSend,
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      setReportData(data.data.data);
      setBackupData(data.data.data);
      setDataSearch(data.data.data);
    };

    const getDepartment = async () => {
      const authData = await AsyncStorage.getItem('@authStorage');
      const userToken = `Bearer ` + JSON.parse(authData).data.access_token;
      const dataSend = {
        groups: 'incidentObject, reportStatus, reportType',
      };
      const {data} = await axios.post(
        `https://qlsc.maysoft.io/server/api/getAllDepartments`,
        dataSend,
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      setDepartment(data.data.data);
    };

    const getCommonData = async () => {
      const authData = await AsyncStorage.getItem('@authStorage');
      const userToken = `Bearer ` + JSON.parse(authData).data.access_token;
      const dataSend = {
        groups: 'incidentObject, reportStatus, reportType',
      };
      const {data} = await axios.post(
        `https://qlsc.maysoft.io/server/api/getCommon`,
        dataSend,
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      setIncidentObject(data.data.incidentObject);
      setReportStatus(data.data.reportStatus);
      setReportType(data.data.reportType);
      setLoading(false);
    };

    getReportData();
    getDepartment();
    getCommonData();
  }, []);

  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedObject, setSelectedObject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const onClickFilter = () => {
    var temp = [...backupData];
    setReportData(temp);
    if (selectedDepartment !== 'all') {
      temp = temp.filter(item => item.departmentName === selectedDepartment);
    }
    if (selectedStatus !== 'all') {
      temp = temp.filter(item => item.status === selectedStatus);
    }
    if (selectedObject !== 'all') {
      temp = temp.filter(item => item.incidentObject === selectedObject);
    }
    if (selectedType !== 'all') {
      temp = temp.filter(item => item.reportType === selectedType);
    }
    setReportData(temp);
    setModalVisible(!modalVisible);
  };

  const filterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Phòng ban</Text>
            <Picker
              selectedValue={selectedDepartment}
              style={{
                height: 50,
                width: 200,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDepartment(itemValue)
              }>
              <Picker.Item label="Tất cả" value="all" />
              {department.map((item, key) => (
                <Picker.Item
                  label={item.departmentName}
                  value={item.departmentName}
                  key={key}
                />
              ))}
            </Picker>

            <Text style={styles.modalText}>Trạng thái</Text>
            <Picker
              selectedValue={selectedStatus}
              style={{
                height: 50,
                width: 200,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedStatus(itemValue)
              }>
              <Picker.Item label="Tất cả" value="all" />
              {reportStatus.map((item, key) => (
                <Picker.Item label={item.name} value={item.code} key={key} />
              ))}
            </Picker>
            <Text style={styles.modalText}>Loại báo cáo</Text>
            <Picker
              selectedValue={selectedType}
              style={{
                height: 50,
                width: 200,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedType(itemValue)
              }>
              <Picker.Item label="Tất cả" value="all" />
              {reportType.map((item, key) => (
                <Picker.Item label={item.name} value={item.code} key={key} />
              ))}
            </Picker>
            <Text style={styles.modalText}>Đối tượng</Text>
            <Picker
              selectedValue={selectedObject}
              style={{
                height: 50,
                width: 200,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedObject(itemValue)
              }>
              <Picker.Item label="Tất cả" value="all" />
              {incidentObject.map((item, key) => (
                <Picker.Item label={item.name} value={item.code} key={key} />
              ))}
            </Picker>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Pressable
                style={[
                  styles.button,
                  {backgroundColor: 'red', borderColor: 'red'},
                ]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Huỷ</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  {backgroundColor: 'green', borderColor: 'green'},
                ]}
                onPress={() => onClickFilter()}>
                <Text style={styles.textStyle}>Lọc</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startD, setStartD] = useState(new Date());
  const [endD, setEndD] = useState(new Date());
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onCancel = () => {
    setShowDatePicker(false);
  };


  const onConfirm = output => {
    const {startDate, startDateString, endDate, endDateString} = output;
    setStartD(startDateString);
    setEndD(endDateString);
    var temp = [...dataSearch];
    temp = temp.filter((item) => item.createTime >= startDate/1000 && item.createTime <= endDate/1000)
    setReportData(temp)
    setBackupData(temp)
    onCancel();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flex: 5}}>
          <View>
            <Pressable onPress={openDatePicker} style={styles.datePickerBox}>
              <Text style={{color: '#000000'}}>
                {formatD(startD)} - {formatD(endD)}
              </Text>
              <Icon name="calendar" size={25} color="#198da0"></Icon>
            </Pressable>
          </View>
          <DatePicker
            isVisible={showDatePicker}
            mode={'range'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 10,
          }}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Icon name="filter" size={40} color="#108ea0"></Icon>
          </Pressable>
        </View>
        {filterModal()}
      </View>
      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '80%',
          }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={reportData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => setIsActive(0)}>
          <Icon
            name="th-list"
            size={20}
            color={isActive === 0 ? '#1d76e0' : '#939393'}></Icon>
          <Text
            style={{
              marginTop: 5,
              color: isActive === 0 ? '#1d76e0' : '#939393',
            }}>
            Danh sách
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => setIsActive(1)}>
          <Icon
            name="tv"
            size={20}
            color={isActive === 1 ? '#1d76e0' : '#939393'}></Icon>
          <Text
            style={{
              marginTop: 5,
              color: isActive === 1 ? '#1d76e0' : '#939393',
            }}
            numberOfLines={1}>
            Theo dõi và giám sát
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => setIsActive(2)}>
          <Icon
            name="adjust"
            size={20}
            color={isActive === 2 ? '#1d76e0' : '#939393'}></Icon>
          <Text
            style={{
              marginTop: 5,
              color: isActive === 2 ? '#1d76e0' : '#939393',
            }}>
            Biểu đồ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => setIsActive(3)}>
          <Icon
            name="bell"
            size={20}
            color={isActive === 3 ? '#1d76e0' : '#939393'}></Icon>
          <Text
            style={{
              marginTop: 5,
              color: isActive === 3 ? '#1d76e0' : '#939393',
            }}>
            Thông báo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => setIsActive(4)}>
          <Icon
            name="user"
            size={20}
            color={isActive === 4 ? '#1d76e0' : '#939393'}></Icon>
          <Text
            style={{
              marginTop: 5,
              color: isActive === 4 ? '#1d76e0' : '#939393',
            }}>
            Cá nhân
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnBottom}>
        <TouchableOpacity style={styles.btnCircle}>
          <Icon name="plus" size={25} color="#ffffff"></Icon>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: '#c7c7c7',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 15,
  },
  datePickerBox: {
    borderWidth: 1,
    marginHorizontal: 15,
    padding: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#198da0',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 8,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#c7c7c7',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  footerItem: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBottom: {
    position: 'absolute',
    bottom: 80,
    right: 30,
  },
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0b8d9d',
    borderColor: '#0b8d9d',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    width: 70,
    // height: 20,
  },
  textStyle: {
    padding: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default HomePage;
