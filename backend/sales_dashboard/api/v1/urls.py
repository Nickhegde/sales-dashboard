from django.urls import path
from . import views

urlpatterns = [
    path("metrics/summary/", views.SummaryMetricsView.as_view()),
    path("metrics/revenue-trend/", views.RevenueTrendView.as_view()),
    path("metrics/revenue-by-region/", views.RevenueByRegionView.as_view()),
    path("metrics/top-products/", views.TopProductsView.as_view()),
    path("metrics/sales-funnel/", views.SalesFunnelView.as_view()),
    path("transactions/", views.TransactionListView.as_view()),
    path("transactions/export/", views.TransactionExportView.as_view()),
]