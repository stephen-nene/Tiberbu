from rest_framework import serializers
from .models import User,Route,Order,MilkCollection
from django.contrib.auth.hashers import make_password
class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id','name','location','synonym','type']

class UserSerializer(serializers.ModelSerializer):
    routes = RouteSerializer(many=True,read_only=True)
    class Meta:
        model = User
        fields = ['id','username','first_name','last_name', 'email', 'role', 'phone_number','profile_image','status','unit_price','routes']

    def validate_status(self, value):
        if value not in ['active', 'inactive', 'deactivated' ]:
            raise serializers.ValidationError("Invalid status. Choose 'active' or 'inactive'.")
        return value
    

class OrderSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    customer = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'employee',
            'customer',
            'amount_issued',
            'order_amount',
            'issuance_date',
            'status',
            'paid',
        ]


    # def get_employee(self, obj):
    #     # Include employee data only for admins and employees
    #     if self.context.get('role') in ['admin', 'employee']:
    #         return UserSerializer(obj.employee).data if obj.employee else None
    #     return None

    # def get_customer(self, obj):
    #     # Include customer data only for admins and employees
    #     if self.context.get('role') in ['admin', 'employee']:
    #         return UserSerializer(obj.customer).data
    #     return None

class CollectionSerializer(serializers.ModelSerializer):
    route = RouteSerializer(read_only=True)
    farmer = UserSerializer(read_only=True)
    employee = UserSerializer(read_only=True)
    class Meta:
        model = MilkCollection
        fields = ['id','amount','route','farmer','employee','created_at','updated_at']
 
class CollectionsSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = MilkCollection
        fields = "__all__"