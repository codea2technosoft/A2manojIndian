import { useState, useEffect, useCallback } from 'react';
import { depositService } from '../services/depositService';

export const useDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    success: 0,
    rejected: 0,
    totalAmount: 0,
  });

  const fetchDeposits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await depositService.getAllDeposits();
      
      if (response.success) {
        setDeposits(response.deposits);
        setFilteredDeposits(response.deposits);
        calculateStats(response.deposits);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(d => d.status === 'pending').length;
    const success = data.filter(d => d.status === 'success').length;
    const rejected = data.filter(d => d.status === 'rejected').length;
    const totalAmount = data
      .filter(d => d.status === 'success')
      .reduce((sum, d) => sum + d.amount, 0);

    setStats({ total, pending, success, rejected, totalAmount });
  };

  const filterDeposits = (searchTerm, statusFilter) => {
    let filtered = deposits;

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.user_id.toLowerCase().includes(search) ||
        d.transaction_id.toLowerCase().includes(search) ||
        d.utr?.toLowerCase().includes(search) ||
        d.user_name.toLowerCase().includes(search) ||
        d.mobile?.includes(search)
      );
    }

    setFilteredDeposits(filtered);
  };

  // Add new deposit from WebSocket
  const addNewDeposit = (newDeposit) => {
    setDeposits(prev => [newDeposit, ...prev]);
    setFilteredDeposits(prev => [newDeposit, ...prev]);
    calculateStats([newDeposit, ...deposits]);
  };

  // Initial fetch
  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return {
    deposits,
    filteredDeposits,
    loading,
    error,
    stats,
    fetchDeposits,
    filterDeposits,
    addNewDeposit,
  };
};