import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .mock_data import (generate_summary, generate_revenue_trend,
    generate_revenue_by_region, generate_top_products,
    generate_sales_funnel, generate_transactions, generate_all_transactions)

def get_days(request, default=365):
    try:
        return int(request.query_params.get("days", default))
    except (ValueError, TypeError):
        return default

class SummaryMetricsView(APIView):
    def get(self, request):
        return Response(generate_summary(get_days(request)))

class RevenueTrendView(APIView):
    def get(self, request):
        return Response(generate_revenue_trend(
            request.query_params.get("period", "monthly"),
            get_days(request)
        ))

class RevenueByRegionView(APIView):
    def get(self, request):
        return Response(generate_revenue_by_region(get_days(request)))

class TopProductsView(APIView):
    def get(self, request):
        return Response(generate_top_products(
            int(request.query_params.get("limit", 5)),
            get_days(request)
        ))

class SalesFunnelView(APIView):
    def get(self, request):
        return Response(generate_sales_funnel(get_days(request)))

class TransactionListView(APIView):
    def get(self, request):
        return Response(generate_transactions(
            int(request.query_params.get("page", 1)),
            get_days(request)
        ))

class TransactionExportView(APIView):
    def get(self, request):
        days = get_days(request)
        transactions = generate_all_transactions(days)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="transactions_{days}d.csv"'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'

        writer = csv.DictWriter(response, fieldnames=["id","date","customer","product","region","rep","amount","status"])
        writer.writeheader()
        writer.writerows(transactions)
        return response