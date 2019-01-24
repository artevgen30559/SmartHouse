<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "action".
 *
 * @property int $id
 * @property int $macro_id
 * @property int $device_id
 * @property string $value
 *
 * @property Device $device
 * @property Macro $macro
 */
class Action extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'action';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['device_id', 'value'], 'required'],
            [['macro_id', 'device_id'], 'integer'],
            [['value'], 'isCorrect'],
            [['value'], 'string', 'max' => 10],
            [['device_id'], 'exist', 'skipOnError' => true, 'targetClass' => Device::className(), 'targetAttribute' => ['device_id' => 'id']],
            [['macro_id'], 'exist', 'skipOnError' => true, 'targetClass' => Macro::className(), 'targetAttribute' => ['macro_id' => 'id']],
        ];
    }

    public function isCorrect($attribute, $params)
    {

        $device = Device::findOne($this->device_id);

        if(!$device) {
            $this->addError('device_id', 'Incorrect id 111');
            return;
        }

        $type_id = $device->type_id;

        if(in_array($type_id, [1,4]) && !in_array($this->value, ['open', 'close']))
            $this->addError('value', 'Value must be open or close!');
        if(in_array($type_id, [2,3]) && !in_array($this->value, ['on', 'off']))
            $this->addError('value', 'Value must be on or off!');
        if($type_id == 5 && (!is_numeric($this->value) || $this->value < -100 || $this->value > 100))
            $this->addError('value', 'Value must be integer between -100 and 100!');
        if($type_id == 6 && (!is_numeric($this->value) || $this->value < 10 || $this->value > 30))
            $this->addError('value', 'Value must be integer between 10 and 30!');
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'macro_id' => 'Macro ID',
            'device_id' => 'Device ID',
            'value' => 'Value',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDevice()
    {
        return $this->hasOne(Device::className(), ['id' => 'device_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMacro()
    {
        return $this->hasOne(Macro::className(), ['id' => 'macro_id']);
    }
}
