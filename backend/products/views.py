from django.http import JsonResponse
from .models import Product


def products_json(request):
    products = Product.objects.select_related('category').all()
    data = []
    for p in products:
        data.append({
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'stock': p.stock,
            'category': p.category.name if p.category else None,
        })
    return JsonResponse({'products': data})